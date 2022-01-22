import { Renderable } from '@/simulator/render/Renderer';
import { color, Locatable, Point } from '@/simulator/utils';

export interface Connectable extends Locatable {
    connectOutput(bus: Connectable): void;
    connectInput(bus: Connectable): void;
    getConnectPoint(direction: Direction): Point;
}

export enum Orientation {
    HORIZONTAL,
    VERTICAL,
}

export enum Direction {
    LEFT,
    RIGHT,
    UP,
    DOWN,
}

export default class Bus implements Renderable, Connectable {
    public inputs: Connectable[] = [];
    public outputs: Connectable[] = [];

    public renderFromConnectable?: Connectable;
    public renderToConnectable?: Connectable;

    public renderFromTriangle: boolean = false;
    public renderToTriangle: boolean = false;

    protected renderFrom?: Point;
    protected renderTo?: Point;

    public x: number = 0;
    public y: number = 0;

    constructor(private size: number, private direction: Orientation) {}

    public connectOutput(bus: Connectable): void {
        this.outputs.push(bus);
    }

    public connectInput(bus: Connectable): void {
        this.inputs.push(bus);
    }

    public calculateRenderPoints() {
        if (!this.renderFromConnectable || !this.renderToConnectable) {
            return;
        }

        if (this.direction == Orientation.HORIZONTAL) {
            if (this.renderFromConnectable.x < this.renderToConnectable.x) {
                this.renderFrom = this.renderFromConnectable.getConnectPoint(Direction.RIGHT);
                this.renderTo = this.renderToConnectable.getConnectPoint(Direction.LEFT);
            } else {
                this.renderFrom = this.renderFromConnectable.getConnectPoint(Direction.LEFT);
                this.renderTo = this.renderToConnectable.getConnectPoint(Direction.RIGHT);
            }
        } else {
            if (this.renderFromConnectable.y < this.renderToConnectable.y) {
                this.renderFrom = this.renderFromConnectable.getConnectPoint(Direction.DOWN);
                this.renderTo = this.renderToConnectable.getConnectPoint(Direction.UP);
            } else {
                this.renderFrom = this.renderFromConnectable.getConnectPoint(Direction.UP);
                this.renderTo = this.renderToConnectable.getConnectPoint(Direction.DOWN);
            }
        }
    }

    public getConnectPoint(direction: Direction): Point {
        if (direction == Direction.LEFT) {
            return { x: this.x - 2.5, y: this.y };
        }

        if (direction == Direction.RIGHT) {
            return { x: this.x + 2.5, y: this.y };
        }

        return this.renderFrom!;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.renderFrom || !this.renderTo) {
            return;
        }

        context.save();

        // bus line
        context.strokeStyle = color('secondary-400');
        context.lineWidth = 5;
        context.beginPath();

        const toX = this.direction == Orientation.VERTICAL ? this.renderFrom.x : this.renderTo.x;
        const toY = this.direction == Orientation.HORIZONTAL ? this.renderFrom.y : this.renderTo.y;

        context.moveTo(this.renderFrom.x, this.renderFrom.y);
        context.lineTo(toX, toY);
        context.stroke();

        // triangles
        if (this.direction == Orientation.VERTICAL) {
            if (this.renderFromTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderFrom,
                    this.renderFrom.y > this.renderTo.y ? Direction.DOWN : Direction.UP
                );
            }

            if (this.renderToTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderTo,
                    this.renderFrom.y > this.renderTo.y ? Direction.UP : Direction.DOWN
                );
            }
        }

        if (this.direction == Orientation.HORIZONTAL) {
            if (this.renderFromTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderFrom,
                    this.renderFrom.x > this.renderTo.x ? Direction.RIGHT : Direction.LEFT
                );
            }

            if (this.renderToTriangle) {
                Bus.renderTriangle(
                    context,
                    { x: toX, y: toY },
                    this.renderFrom.x > this.renderTo.x ? Direction.LEFT : Direction.RIGHT
                );
            }
        }

        const middle = {
            x: this.renderFrom.x + (toX - this.renderFrom.x) / 2,
            y: this.renderFrom.y + (toY - this.renderFrom.y) / 2,
        };

        // middle
        context.beginPath();
        context.strokeStyle = color('secondary-900');
        context.lineWidth = 2;
        context.moveTo(middle.x - 12, middle.y + 12);
        context.lineTo(middle.x + 12, middle.y - 12);
        context.stroke();

        context.fillStyle = color('secondary-900');
        if (this.direction == Orientation.HORIZONTAL) {
            context.fillText(this.size + '', middle.x - 4, middle.y + 15);
        } else {
            context.fillText(this.size + '', middle.x + 4, middle.y + 9);
        }

        context.restore();
    }

    private static renderTriangle(context: CanvasRenderingContext2D, location: Point, direction: Direction) {
        context.beginPath();
        context.fillStyle = color('secondary-400');

        if (direction == Direction.UP) {
            context.clearRect(location.x - 3, location.y - 2, 6, 8);
            context.moveTo(location.x, location.y);
            context.lineTo(location.x + 6, location.y + 7);
            context.lineTo(location.x - 6, location.y + 7);
        }

        if (direction == Direction.DOWN) {
            context.clearRect(location.x - 3, location.y - 6, 6, 8);
            context.moveTo(location.x, location.y);
            context.lineTo(location.x + 6, location.y - 7);
            context.lineTo(location.x - 6, location.y - 7);
        }

        if (direction == Direction.LEFT) {
            context.clearRect(location.x - 2, location.y - 3, 8, 6);
            context.moveTo(location.x, location.y);
            context.lineTo(location.x + 7, location.y + 6);
            context.lineTo(location.x + 7, location.y - 6);
        }

        if (direction == Direction.RIGHT) {
            context.clearRect(location.x - 6, location.y - 3, 8, 6);
            context.moveTo(location.x, location.y);
            context.lineTo(location.x - 7, location.y + 6);
            context.lineTo(location.x - 7, location.y - 6);
        }

        context.fill();
    }
}
