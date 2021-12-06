import { splitProps } from 'solid-js';
import { Box, StyledComponent } from './Box';
import { ResponsiveValue, mapResponsive } from './Theme';

export const AspectRatio: StyledComponent<{ ratio: ResponsiveValue<number> }> =
  (props) => {
    const [local, boxProps] = splitProps(props, ['ratio']);
    return (
      <Box
        {...boxProps}
        position="relative"
        _before={{
          height: 0,
          content: `""`,
          display: 'block',
          paddingBottom: mapResponsive(local.ratio, (r) => `${(1 / r) * 100}%`)
        }}
        __css={{
          '& > *:not(style)': {
            overflow: 'hidden',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          },
          '& > img, & > video': {
            objectFit: 'cover'
          }
        }}
      />
    );
  };
