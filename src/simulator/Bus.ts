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

    // the connectables to render the bus between
    public renderStartConnectable?: Connectable;
    public renderEndConnectable?: Connectable;

    // whether to render triangles at the start and end points of the bus
    public renderStartTriangle: boolean = false;
    public renderEndTriangle: boolean = false;

    // the start and end points of the bus used for rendering
    protected renderStart?: Point;
    protected renderEnd?: Point;

    public x: number = 0;
    public y: number = 0;

    constructor(private size: number, private direction: Orientation) {}

    public connectOutput(bus: Connectable): void {
        this.outputs.push(bus);
    }

    public connectInput(bus: Connectable): void {
        this.inputs.push(bus);
    }

    //---- following are just functions for rendering the bus ----//

    // figure out the start and end points of the bus
    public calculateRenderPoints() {
        if (!this.renderStartConnectable || !this.renderEndConnectable) {
            return;
        }

        if (this.direction == Orientation.HORIZONTAL) {
            if (this.renderStartConnectable.x < this.renderEndConnectable.x) {
                this.renderStart = this.renderStartConnectable.getConnectPoint(Direction.RIGHT);
                this.renderEnd = this.renderEndConnectable.getConnectPoint(Direction.LEFT);
            } else {
                this.renderStart = this.renderStartConnectable.getConnectPoint(Direction.LEFT);
                this.renderEnd = this.renderEndConnectable.getConnectPoint(Direction.RIGHT);
            }
        } else {
            if (this.renderStartConnectable.y < this.renderEndConnectable.y) {
                this.renderStart = this.renderStartConnectable.getConnectPoint(Direction.DOWN);
                this.renderEnd = this.renderEndConnectable.getConnectPoint(Direction.UP);
            } else {
                this.renderStart = this.renderStartConnectable.getConnectPoint(Direction.UP);
                this.renderEnd = this.renderEndConnectable.getConnectPoint(Direction.DOWN);
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

        return this.renderStart!;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.renderStart || !this.renderEnd) {
            return;
        }

        context.save();

        const toX = this.direction == Orientation.VERTICAL ? this.renderStart.x : this.renderEnd.x;
        const toY = this.direction == Orientation.HORIZONTAL ? this.renderStart.y : this.renderEnd.y;

        this.renderBusLine(context, toX, toY);
        this.renderTriangles(context, toX, toY);
        this.renderMiddleInfo(toX, toY, context);

        context.restore();
    }

    private renderMiddleInfo(toX: number, toY: number, context: CanvasRenderingContext2D) {
        const middle = {
            x: this.renderStart!.x + (toX - this.renderStart!.x) / 2,
            y: this.renderStart!.y + (toY - this.renderStart!.y) / 2,
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
    }

    private renderTriangles(context: CanvasRenderingContext2D, toX: number, toY: number) {
        if (this.direction == Orientation.VERTICAL) {
            if (this.renderStartTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderStart!,
                    this.renderStart!.y > this.renderEnd!.y ? Direction.DOWN : Direction.UP
                );
            }

            if (this.renderEndTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderEnd!,
                    this.renderStart!.y > this.renderEnd!.y ? Direction.UP : Direction.DOWN
                );
            }
        }

        if (this.direction == Orientation.HORIZONTAL) {
            if (this.renderStartTriangle) {
                Bus.renderTriangle(
                    context,
                    this.renderStart!,
                    this.renderStart!.x > this.renderEnd!.x ? Direction.RIGHT : Direction.LEFT
                );
            }

            if (this.renderEndTriangle) {
                Bus.renderTriangle(
                    context,
                    { x: toX, y: toY },
                    this.renderStart!.x > this.renderEnd!.x ? Direction.LEFT : Direction.RIGHT
                );
            }
        }
    }

    private renderBusLine(context: CanvasRenderingContext2D, toX: number, toY: number) {
        context.strokeStyle = color('secondary-400');
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(this.renderStart!.x, this.renderStart!.y);
        context.lineTo(toX, toY);
        context.stroke();
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
