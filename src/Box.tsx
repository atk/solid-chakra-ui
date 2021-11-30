import { JSX } from 'solid-js';
import { CSSAttribute, styled, Tagged } from 'solid-styled-components';
import { splitStyleProps, CSSProps } from './props';

export type AsNodeProps<
  Props extends { as?: JSX.IntrinsicElements } & Record<string, any>,
  DefaultNode extends keyof JSX.IntrinsicElements,
  ExtraProps extends Record<string, any>,
> =
  Props extends { as: infer NodeName }
  ? { as: NodeName } &
    Partial<JSX.IntrinsicElements[NodeName & keyof JSX.IntrinsicElements]> &
    Partial<CSSProps> & ExtraProps
  : Partial<JSX.IntrinsicElements[DefaultNode]> & Partial<CSSProps> & ExtraProps;

export type StyledComponent<
  ExtraProps extends Record<string, any> = {},
  DefaultNode extends keyof JSX.IntrinsicElements = 'div'
> = <Props>(props: Props & AsNodeProps<Props, DefaultNode, ExtraProps>) => JSX.Element;

const tags: Partial<Record<keyof JSX.IntrinsicElements, Tagged<keyof JSX.IntrinsicElements>>> = {};

export const Box: StyledComponent = (props) => {
  const splittedProps = splitStyleProps(props, 'div');
  const tag = tags[splittedProps.as] || (tags[splittedProps.as] = styled(splittedProps.as));
  const Tag: (props: any) => JSX.Element = tag(splittedProps.styleProps);
  return <Tag {...splittedProps.componentProps} />;
};

export const Square: StyledComponent<{ size: string }> = (props) => (
  <Box {...props} boxSize={props.size} flexShrink="0" flexGrow="0" />
);

export const Circle: StyledComponent<{ size: string }> = (props) => (
  <Box {...props} boxSize={props.size} flexShrink="0" flexGrow="0" borderRadius="9999px" />
);
