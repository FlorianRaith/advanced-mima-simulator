export interface Locatable {
    x: number;
    y: number;
}

export interface Point extends Locatable {}

export enum Direction {
    RIGHT = 0,
    DOWN = 0.5 * Math.PI,
    LEFT = Math.PI,
    UP = 1.5 * Math.PI,
}

// retrieve a tailwind color via css variable
export function color(value: string): string {
    const canvas = document.getElementById('canvas') as HTMLElement;
    return getComputedStyle(canvas).getPropertyValue('--' + value);
}

export function asBinaryString(value: number): string {
    return (value >>> 0).toString(2);
}

export function floor5(value: number): number {
    return Math.floor(value * 10000) / 10000;
}

// export function vectorLength(vector: Point): number {
//     return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
// }
//
// export function origin(): Point {
//     return { x: 0, y: 0 };
// }
//
// export function isSamePoint(a: Point, b: Point): boolean {
//     return a.x === b.x && a.y === b.y;
// }
//
// export function copyPoint(point: Point): Point {
//     return { x: point.x, y: point.y };
// }
//
export function oppositeDirection(direction: Direction): Direction {
    if (direction === Direction.UP) {
        return Direction.DOWN;
    } else if (direction === Direction.DOWN) {
        return Direction.UP;
    } else if (direction === Direction.LEFT) {
        return Direction.RIGHT;
    } else if (direction === Direction.RIGHT) {
        return Direction.LEFT;
    }

    throw new Error('Invalid direction');
}
