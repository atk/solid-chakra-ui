import { createEffect, JSX } from 'solid-js';
import { createStore, Store, unwrap } from 'solid-js/store';
import { isServer } from 'solid-js/web';
import { cssProps } from './cssProps';

const toCamelCase = (attr: string) =>
  attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const cssProperties = isServer
  ? cssProps
  : Object.getOwnPropertyNames(getComputedStyle(document.body)).filter((name) =>
      /\D+/.test(name)
    );

const shorthandProps = {
  m: 'margin',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  w: 'width',
  h: 'height',
  size: 'size',
  boxSize: ['height', 'width']
};

export type CSSSelectorProps = `_${
  | '_css'
  | 'hover'
  | 'focus'
  | 'before'
  | 'after'}`;

export type CSSProp = keyof (CSSStyleDeclaration & typeof shorthandProps);

export type CSSProps = Record<string & CSSProp, string>;

export type SplittedProps = {
  as: string & keyof JSX.IntrinsicElements;
  styleProps: Record<string, string>;
  componentProps: Record<string, string>;
};

/**
 * Reactively split props into static styles, dynamic styles and component props
 * Remove `as`
 */
export const splitStyleProps = (
  props: Store<Record<string, any>>,
  asFallback: keyof JSX.IntrinsicElements
): SplittedProps => {
  const [splitted, setSplitted] = createStore<SplittedProps>({
    as: props.as || asFallback,
    styleProps: {},
    componentProps: {}
  });
  Object.keys(props).forEach((propName) => {
    if (propName === 'as') {
      return;
    }
    if (propName === '__css') {
      setSplitted('styleProps', (styles) => ({ ...styles, ...props.__css }));
      return;
    }
    if (propName.startsWith('_')) {
      const pseudoClass = `&:${propName.slice(1)}`;
      setSplitted('styleProps', (styles) => ({
        ...styles,
        [pseudoClass]: {
          ...(unwrap(styles[pseudoClass]) ?? {}),
          ...props[propName]
        }
      }));
      return;
    }
    const styleNames: string[] = [];
    const camelCasePropName = toCamelCase(propName);
    if (cssProperties.includes(propName)) {
      styleNames.push(propName);
    } else if (cssProperties.includes(camelCasePropName)) {
      styleNames.push(camelCasePropName);
    } else if (propName in shorthandProps) {
      const shorthandPropName = propName as string &
        keyof typeof shorthandProps;
      if (Array.isArray(shorthandProps[shorthandPropName])) {
        styleNames.push(...shorthandProps[shorthandPropName]);
      } else {
        styleNames.push(shorthandProps[shorthandPropName] as string);
      }
    }
    if (styleNames.length === 0) {
      setSplitted('componentProps', propName, props[propName]);
      createEffect(() =>
        setSplitted('componentProps', propName, props[propName])
      );
    } else {
      styleNames.forEach((name) => {
        setSplitted('styleProps', name, props[propName]);
        createEffect(() => setSplitted('styleProps', name, props[propName]));
      });
    }
  });

  return splitted;
};
