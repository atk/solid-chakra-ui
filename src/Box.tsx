import { Component, JSX } from 'solid-js';
import { style } from '@vanilla-extract/css';
import { splitStyleProps } from './props';
import { spread } from 'solid-js/web';

export type BoxProps<E extends keyof JSX.IntrinsicElements = 'div'> =
  { as?: E } &
  Partial<JSX.IntrinsicElements[E]> &
  Record<string & keyof CSSStyleDeclaration, string>;


export const Box: Component<BoxProps> = (props) => {
  const splittedProps = splitStyleProps(props);

  const staticStylesClassName = style(splittedProps.staticStyles);
  const dynamicStylesClassName = style(splittedProps.dynamicStyles);

  const tagName = props.as ?? 'div';
  const tag = document.createElement(tagName);
  tag.classList.add(staticStylesClassName);
  tag.classList.add(dynamicStylesClassName);
  spread(tag, () => splittedProps.componentProps);
  return tag;
};
