import { cssProps } from '../src/cssProps';

/* fix getComputedStyle to always provide all style attributes just like in the browser */

const originalGetComputedStyle = window.getComputedStyle;

window.getComputedStyle = globalThis.getComputedStyle = function (elt, pseudoElt = undefined) {
  const declaration = originalGetComputedStyle(elt, pseudoElt);
  cssProps.forEach(prop => Object.defineProperty(declaration, prop, { value: declaration[prop] || '', enumerable: true }));
  return declaration;
};
