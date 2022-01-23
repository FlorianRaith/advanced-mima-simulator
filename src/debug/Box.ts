import { Renderable } from '@/engine/Renderer';
import { color, Direction } from '@/engine/utils';
import { Connectable } from '@/engine/lines/ConnectingLine';
import { BoundingBox } from '@/engine/lines/Boundary';
import Vector from '@/engine/Vector';
import { DEBUG } from '@/debug/DebugController';

export default class Box implements Renderable, Connectable {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = color('secondary-400');
        context.fillRect(this.x, this.y, this.width, this.height);

        if (DEBUG) {
            const allDirections = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
            for (const direction of allDirections) {
                const point = this.getBoundary().getConnectPoint(direction);

                context.beginPath();
                context.rect(point.x - 0.5, point.y - 0.5, 1, 1);
                context.lineWidth = 1;
                context.fillStyle = 'yellow';
                context.fill();
            }
        }
    }

    getBoundary(): BoundingBox {
        return new BoundingBox(new Vector(this.x, this.y), new Vector(this.x + this.width, this.y + this.height));
    }
}
