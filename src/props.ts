import { createSignal, JSX, splitProps } from 'solid-js';
import { isServer } from 'solid-js/web';
import { cssProps } from './cssProps';

export type ChakraSize = `${3 | 4 | 5 | 6}xl` | 'xxl' | 'xl' | 'l' | 'm' | 's';

type CSSProps = JSX.CSSProperties;

const toCamelCase = (attr: string) => attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const toKebapCase = (attr: string) => attr.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const addKebapCase = (props: readonly string[] | string[]): string[] => [
  ...props,
  ...(props as string[]).reduce<string[]>((cc, name) => {
    /[A-Z]/.test(name) && cc.push(toKebapCase(name));
    return cc;
  }, [])];

const CSSProperties = isServer
  ? addKebapCase(cssProps)
  : addKebapCase(Object.getOwnPropertyNames(getComputedStyle(document.body)).filter((name) =>
      /\D+/.test(name)
    ));

const chakraCSSProps = {
  m: 'margin',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'padding-top',
  w: 'width',
  h: 'height',
  size: 'size',
  boxSize: 'boxSize',
} as const;

export type ChakraCSSShorthandProps = {
  m: CSSProps['margin'];
  mb: CSSProps['margin-bottom'];
  ml: CSSProps['margin-left'];
  mr: CSSProps['margin-right'];
  mt: CSSProps['margin-top'];
  p: CSSProps['padding'];
  pb: CSSProps['padding-bottom'];
  pl: CSSProps['padding-left'];
  pr: CSSProps['padding-right'];
  pt: CSSProps['padding-top'];
  w: CSSProps['width'];
  h: CSSProps['height'];
  size: ChakraSize;
  boxSize: CSSProps['width'];
  as: keyof JSX.IntrinsicElements
};

export type ChakraCSSProps = CSSProps & ChakraCSSShorthandProps;

export type RawProps = Record<string, any> & Partial<ChakraCSSProps>;

export const stylePropKeys = [...CSSProperties, ...Object.keys(chakraCSSProps)]

export type FilteredProps<P extends RawProps> = {
  [key in keyof P as 
    key extends keyof typeof chakraCSSProps
      ? (typeof chakraCSSProps)[key]
      : key
  ]: P[key]
}

export type AugmentedProps<P, F = FilteredProps<P>> = [
  Omit<F, keyof ChakraCSSProps>,
  Pick<F, keyof F & keyof ChakraCSSProps>
];

export const filterShortHands = <P extends RawProps>(props: P): FilteredProps<P> =>
  Object.keys(props).reduce((filteredProps, key) => {
    if (key in chakraCSSProps) {
      if (key.toLowerCase() === 'boxsize') {
        Object.assign(filteredProps, { width: props[key], height: props[key] });
      } else {
        filteredProps[
          chakraCSSProps[key as keyof typeof chakraCSSProps] as keyof FilteredProps<P>
        ] = props[key];
      }
    } else {
      filteredProps[key as keyof FilteredProps<P>] = props[key];
    }
    return filteredProps;
  }, {} as Partial<FilteredProps<P>>) as any as FilteredProps<P>

export const splitStyles = <P extends RawProps>(
  props: P
): AugmentedProps<P> => {
  const filteredProps = filterShortHands(props);
  const styleProps =
    stylePropKeys.filter(key => key in filteredProps);
  if (styleProps.length > 0) {
    return splitProps(
      filteredProps,
      styleProps as any
    ) as any;
  } else {
    return [{}, props] as any
  }
};
