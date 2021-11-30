import { Component, JSX } from 'solid-js';
import { styled, Tagged } from 'solid-styled-components';
import { splitStyleProps, SplittedProps } from './props';

export type BoxProps<P extends { as?: JSX.IntrinsicElements } & Record<string, any>> =
  P extends { as: infer E }
  ? { as: E } &
    Partial<JSX.IntrinsicElements[E & keyof JSX.IntrinsicElements]> &
    Partial<Record<string & keyof CSSStyleDeclaration, string>>
  : Partial<JSX.IntrinsicElements['div']> &
    Partial<Record<string & keyof CSSStyleDeclaration, string>>;

export type BoxComponent = <P>(props: P & BoxProps<P>) => JSX.Element;

const tags: Partial<Record<keyof JSX.IntrinsicElements, Tagged<keyof JSX.IntrinsicElements>>> = {};

export const Box: BoxComponent = (props) => {
  const splittedProps = splitStyleProps(props, 'div');
  const tag = tags[splittedProps.as] || (tags[splittedProps.as] = styled(splittedProps.as));
  const Tag: (props: any) => JSX.Element = tag(splittedProps.styleProps);
  return <Tag {...splittedProps.componentProps} />;
};
