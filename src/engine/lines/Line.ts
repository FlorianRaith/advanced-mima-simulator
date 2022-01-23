import { Renderable } from '@/engine/Renderer';
import { color, Direction, Point } from '@/engine/utils';
import { DEBUG } from '@/debug/DebugController';
import Vector from '@/engine/Vector';

export enum LineBranch {
    Y_FIRST,
    X_FIRST,
    Y_FIRST_MIDDLE,
    X_FIRST_MIDDLE,
    AUTO_MIDDLE,
}

export default class Line implements Renderable {
    public width: number = 5;
    public color: string = 'secondary-400';

    public renderFromTriangle: boolean = false;
    public renderToTriangle: boolean = false;

    public fromTriangleDirection: Direction = Direction.UP;
    public toTriangleDirection: Direction = Direction.UP;

    private betweenPoints: Vector[] = [];
    private _branch: LineBranch = LineBranch.Y_FIRST;

    constructor(public from: Vector, public to: Vector) {
        this.calculateBetweenPoints();
        this.fromTriangleDirection = this.calculateFromDirection();
        this.toTriangleDirection = this.calculateToDirection();
    }

    set branch(branch: LineBranch) {
        if (branch == LineBranch.AUTO_MIDDLE) {
            if (Math.abs(this.from.x - this.to.x) < Math.abs(this.from.y - this.to.y)) {
                branch = LineBranch.X_FIRST_MIDDLE;
            } else {
                branch = LineBranch.Y_FIRST_MIDDLE;
            }
        }

        this._branch = branch;
        this.calculateBetweenPoints();
        this.fromTriangleDirection = this.calculateFromDirection();
        this.toTriangleDirection = this.calculateToDirection();
    }

    get isStraight(): boolean {
        return this.from.x === this.to.x || this.from.y === this.to.y;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();

        let from = this.from.clone();
        let to = this.to.clone();

        if (this.renderFromTriangle) {
            from = this.from.subtract(Vector.fromDirection(this.fromTriangleDirection).multiply(this.width));
            this.renderAngledTriangle(context, from, this.fromTriangleDirection);
        }

        if (this.renderToTriangle) {
            to = this.to.subtract(Vector.fromDirection(this.toTriangleDirection).multiply(this.width));
            this.renderAngledTriangle(context, to, this.toTriangleDirection);
        }

        // line
        context.strokeStyle = color(this.color);
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(from.x, from.y);
        for (const point of this.betweenPoints) {
            context.lineTo(point.x, point.y);
        }
        context.lineTo(to.x, to.y);
        context.stroke();

        if (DEBUG) {
            // red circle
            context.beginPath();
            context.rect(this.from.x - 0.5, this.from.y - 0.5, 1, 1);
            context.lineWidth = 1;
            context.fillStyle = 'red';
            context.fill();

            // blue circle
            context.beginPath();
            context.rect(this.to.x - 0.5, this.to.y - 0.5, 1, 1);
            context.lineWidth = 1;
            context.fillStyle = 'blue';
            context.fill();
        }

        context.restore();
    }

    private calculateBetweenPoints() {
        if (this.isStraight) {
            return;
        }

        if (this._branch == LineBranch.Y_FIRST) {
            this.betweenPoints = [new Vector(this.from.x, this.to.y)];
        }

        if (this._branch == LineBranch.X_FIRST) {
            this.betweenPoints = [new Vector(this.to.x, this.from.y)];
        }

        if (this._branch == LineBranch.Y_FIRST_MIDDLE) {
            this.betweenPoints = [
                new Vector(this.from.x, this.from.y + (this.to.y - this.from.y) / 2),
                new Vector(this.to.x, this.from.y + (this.to.y - this.from.y) / 2),
            ];
        }

        if (this._branch == LineBranch.X_FIRST_MIDDLE) {
            this.betweenPoints = [
                new Vector(this.from.x + (this.to.x - this.from.x) / 2, this.from.y),
                new Vector(this.from.x + (this.to.x - this.from.x) / 2, this.to.y),
            ];
        }
    }

    private calculateFromDirection(): Direction {
        if (this.from.x == this.to.x) {
            return this.from.y < this.to.y ? Direction.UP : Direction.DOWN;
        }

        if (this.from.y == this.to.y) {
            return this.from.x < this.to.x ? Direction.LEFT : Direction.RIGHT;
        }

        if (this._branch == LineBranch.X_FIRST || this._branch == LineBranch.X_FIRST_MIDDLE) {
            return this.from.x < this.to.x ? Direction.LEFT : Direction.RIGHT;
        }

        if (this._branch == LineBranch.Y_FIRST || this._branch == LineBranch.Y_FIRST_MIDDLE) {
            return this.from.y < this.to.y ? Direction.UP : Direction.DOWN;
        }

        throw new Error('Unknown branch');
    }

    private calculateToDirection(): Direction {
        if (this.from.x == this.to.x) {
            return this.from.y > this.to.y ? Direction.UP : Direction.DOWN;
        }

        if (this.from.y == this.to.y) {
            return this.from.x > this.to.x ? Direction.LEFT : Direction.RIGHT;
        }

        if (this._branch == LineBranch.X_FIRST || this._branch == LineBranch.Y_FIRST_MIDDLE) {
            return this.from.y > this.to.y ? Direction.UP : Direction.DOWN;
        }

        if (this._branch == LineBranch.Y_FIRST || this._branch == LineBranch.X_FIRST_MIDDLE) {
            return this.from.x > this.to.x ? Direction.LEFT : Direction.RIGHT;
        }

        throw new Error('Unknown branch');
    }

    private renderAngledTriangle(context: CanvasRenderingContext2D, location: Point, angle: number) {
        context.translate(location.x, location.y);
        context.rotate(angle + Math.PI / 2);
        context.beginPath();
        context.moveTo(0, -this.width);
        context.lineTo(-this.width, 0.5 * this.width);
        context.lineTo(this.width, 0.5 * this.width);
        context.fillStyle = color(this.color);
        context.fill();
        context.rotate(-(angle + Math.PI / 2));
        context.translate(-location.x, -location.y);
    }
}
