import { Direction, Point } from '@/engine/utils';

export default class Vector implements Point {
    constructor(public x: number, public y: number) {}

    public static origin(): Vector {
        return new Vector(0, 0);
    }

    public static fromDirection(direction: Direction): Vector {
        return new Vector(Math.cos(direction), Math.sin(direction));
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public addX(x: number): Vector {
        return new Vector(this.x + x, this.y);
    }

    public addY(y: number): Vector {
        return new Vector(this.x, this.y + y);
    }

    public subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    public multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }
}
