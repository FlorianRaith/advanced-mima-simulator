import Vector from '@/engine/Vector';
import { Direction } from '@/engine/utils';
import ConnectingLine from '@/engine/lines/ConnectingLine';

export interface Boundary {}

export class BoundingBox implements Boundary {
    constructor(public readonly topLeft: Vector, public readonly bottomRight: Vector) {}

    public getConnectPoint(direction: Direction): Vector {
        if (direction === Direction.RIGHT) {
            return this.bottomRight.addY((this.topLeft.y - this.bottomRight.y) / 2);
        }

        if (direction === Direction.LEFT) {
            return this.topLeft.addY((this.bottomRight.y - this.topLeft.y) / 2);
        }

        if (direction === Direction.UP) {
            return this.topLeft.addX((this.bottomRight.x - this.topLeft.x) / 2);
        }

        if (direction === Direction.DOWN) {
            return this.bottomRight.addX((this.topLeft.x - this.bottomRight.x) / 2);
        }

        throw new Error('Not implemented');
    }

    get center(): Vector {
        return this.topLeft
            .addX((this.bottomRight.x - this.topLeft.x) / 2)
            .addY((this.bottomRight.y - this.topLeft.y) / 2);
    }
}

export class BoundingLine implements Boundary {
    constructor(public readonly start: Vector, public readonly end: Vector) {}

    public getConnectPoint(from: Vector): Vector {
        if (Math.abs(this.start.x - this.end.x) < Math.abs(this.start.y - this.end.y)) {
            // vertical
            const offset = this.start.x > from.x ? -ConnectingLine.WIDTH / 2 : ConnectingLine.WIDTH / 2;
            return new Vector(this.start.x + offset, from.y);
        }

        // horizontal
        const offset = this.start.y > from.y ? -ConnectingLine.WIDTH / 2 : ConnectingLine.WIDTH / 2;
        return new Vector(from.x, this.start.y + offset);
    }
}
