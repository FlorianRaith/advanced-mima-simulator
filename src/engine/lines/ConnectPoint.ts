import { Connectable } from '@/engine/lines/ConnectingLine';
import { Boundary } from '@/engine/lines/Boundary';
import Vector from '@/engine/Vector';

export class ConnectPoint extends Vector implements Connectable, Boundary {
    getBoundary(): Boundary {
        return this;
    }
}
