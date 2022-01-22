import Bus, { Orientation } from '@/simulator/Bus';
import { Point } from '@/simulator/utils';

export default class MainBus extends Bus {
    constructor(size: number, private from: Point, private to: Point) {
        super(size, Orientation.VERTICAL);
        this.renderStart = from;
        this.renderEnd = to;

        const middle = {
            x: this.renderStart.x + (this.renderEnd.x - this.renderStart.x) / 2,
            y: this.renderStart.y + (this.renderEnd.y - this.renderStart.y) / 2,
        };

        this.x = middle.x;
        this.y = middle.y;

        this.renderStartTriangle = true;
        this.renderEndTriangle = true;
    }

    public calculateRenderPoints() {}
}
