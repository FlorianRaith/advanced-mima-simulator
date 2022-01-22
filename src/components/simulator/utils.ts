export interface Point {
  x: number;
  y: number;
}

// retrieve a tailwind color via css variable
export function color(value: string): string {
  const canvas = document.getElementById('canvas') as HTMLElement;
  return getComputedStyle(canvas).getPropertyValue('--' + value);
}
