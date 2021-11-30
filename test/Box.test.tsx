import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { render, cleanup } from 'solid-testing-library';
import { hasStyle } from 'solid-dom-testing'

import { Box } from '../src/Box'

test.after(cleanup);

test('will render a box', () => {
  const { container } = render(() => <Box />);
  const nodes = container.querySelectorAll('*');
  assert.is(nodes.length, 1, 'more than one node rendered');
  assert.is(nodes[0].nodeName.toLowerCase(), 'div', 'not a div');  
});

test('will render a box as="span"', () => {
  const { container } = render(() => <Box as="span" />);
  const nodes = container.querySelectorAll('*');
  assert.is(nodes.length, 1, 'more than one node rendered');
  assert.is(nodes[0].nodeName.toLowerCase(), 'span', 'not a span');  
});

test('will add styles to the box', () => {
  const { container } = render(() => <Box w="100px" />);
  const node = container.querySelector('div');
  assert.ok(hasStyle(node, { width: '100px' }), 'width is not 100');
});

test.run();
