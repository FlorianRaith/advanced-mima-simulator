import { Connectable } from '@/engine/lines/ConnectingLine';
import { Boundary } from '@/engine/lines/Boundary';
import Vector from '@/engine/Vector';

export class ConnectPoint extends Vector implements Connectable, Boundary {
    public static of(vector: Vector): ConnectPoint {
        return new ConnectPoint(vector.x, vector.y);
    }

    getBoundary(): Boundary {
        return this;
    }
}
