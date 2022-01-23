export interface Locatable {
    x: number;
    y: number;
}

export interface Point extends Locatable {}

// retrieve a tailwind color via css variable
export function color(value: string): string {
    const canvas = document.getElementById('canvas') as HTMLElement;
    return getComputedStyle(canvas).getPropertyValue('--' + value);
}

export function asBinaryString(value: number): string {
    return (value >>> 0).toString(2);
}
