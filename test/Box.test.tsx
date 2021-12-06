import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { render, cleanup } from 'solid-testing-library';
import { hasStyle } from 'solid-dom-testing';

import { Box, Square, Circle } from '../src/Box';

const boxTest = suite('Box');

boxTest.after(cleanup);

boxTest('will render a box', () => {
  const { container } = render(() => <Box />);
  const nodes = container.querySelectorAll('*');
  assert.is(nodes.length, 1, 'more than one node rendered');
  assert.is(nodes[0].nodeName.toLowerCase(), 'div', 'not a div');
});

boxTest('will render a box as="span"', () => {
  const { container } = render(() => <Box as="span" />);
  const nodes = container.querySelectorAll('*');
  assert.is(nodes.length, 1, 'more than one node rendered');
  assert.is(nodes[0].nodeName.toLowerCase(), 'span', 'not a span');
});

boxTest('will add styles to the box', () => {
  const { container } = render(() => <Box w="100px" />);
  const node = container.querySelector('div');
  assert.ok(hasStyle(node, { width: '100px' }), 'width is not 100');
});

boxTest.run();

const squareTest = suite('Square');

squareTest.after(cleanup);

squareTest('will have the same width and height', () => {
  const { container } = render(() => <Square size="100px" />);
  const node = container.querySelector('div');
  assert.ok(
    hasStyle(node, { width: '100px', height: '100px' }),
    'width and height not congruent with size setting'
  );
});

squareTest('flex grow and shrink are fixed to zero', () => {
  const { container } = render(() => <Square size="100px" />);
  const node = container.querySelector('div');
  assert.ok(
    hasStyle(node, { 'flex-grow': '0', 'flex-shrink': '0' }),
    'flex grow or shrink are not zero'
  );
});

squareTest.run();

const circleTest = suite('Circle');

circleTest.after(cleanup);

circleTest('has a border radius of 9999px', () => {
  const { container } = render(() => <Circle size="100px" />);
  const node = container.querySelector('div');
  assert.ok(
    hasStyle(node, { borderRadius: '9999px' }),
    'border radius other than 9999px'
  );
});

circleTest.run();
