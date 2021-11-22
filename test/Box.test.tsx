import test from 'tape';
import { render, cleanup } from 'solid-testing-library';
import { Box } from '../src/Box'

test.skip('will render a box', (t) => {
  const { container } = render(() => <Box />);
  const nodes = container.querySelectorAll('*');
  t.is(nodes.length, 1, 'more than one node rendered');
  t.is(nodes[0].nodeName.toLowerCase(), 'div', 'not a div');
  cleanup();
});
