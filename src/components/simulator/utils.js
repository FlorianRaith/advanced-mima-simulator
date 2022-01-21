// retrieve a tailwind color via css variable
export function color(value) {
  return getComputedStyle(document.getElementById('canvas')).getPropertyValue('--' + value);
}
