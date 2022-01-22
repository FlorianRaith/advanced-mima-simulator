import Bus, { Orientation } from '@/simulator/Bus';
import { Point } from '@/simulator/utils';

export default class MainBus extends Bus {
    constructor(size: number, private from: Point, private to: Point) {
        super(size, Orientation.VERTICAL);
        this.renderFrom = from;
        this.renderTo = to;

        const middle = {
            x: this.renderFrom.x + (this.renderTo.x - this.renderFrom.x) / 2,
            y: this.renderFrom.y + (this.renderTo.y - this.renderFrom.y) / 2,
        };

        this.x = middle.x;
        this.y = middle.y;

        this.renderFromTriangle = true;
        this.renderToTriangle = true;
    }

    public calculateRenderPoints() {}
}
