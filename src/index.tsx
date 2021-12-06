import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { Box } from './Box';

render(() => {
  const [h, setH] = createSignal('100px');
  return (
    <Box color="red" h={h()} w="50%">
      Test
    </Box>
  );
}, document.body);
