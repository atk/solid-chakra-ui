import { Component, JSX } from 'solid-js';
import { styled, Tagged } from 'solid-styled-components';
import { splitStyles, ChakraCSSProps } from './props';

export type BoxProps = Partial<JSX.HTMLAttributes<HTMLDivElement> & ChakraCSSProps>;

// cache styled components
const tags: Record<string, Tagged<any>> = {};

export const Box: Component<BoxProps> = (props) => {
  const [styleProps, boxProps] = splitStyles(props);

  const tagName = props.as ?? 'div';
  const tag =
    (!('ref' in props) && tags[tagName]) || (tags[tagName] = styled(tagName));
  const Tag = tag(() => styleProps);
  return <Tag {...boxProps} />;
};
