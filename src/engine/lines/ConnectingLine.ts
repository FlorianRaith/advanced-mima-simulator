import { Renderable } from '@/engine/Renderer';
import { Boundary, BoundingBox, BoundingLine } from '@/engine/lines/Boundary';
import Line, { LineBranch } from '@/engine/lines/Line';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';
import Vector from '@/engine/Vector';
import { oppositeDirection } from '@/engine/utils';

export interface Connectable {
    getBoundary(): Boundary;
}

export enum LineType {
    NON_DIRECTIONAL,
    UNIDIRECTIONAL,
    BIDIRECTIONAL,
}

export default class ConnectingLine implements Renderable, Connectable {
    public static readonly WIDTH = 5;
    private line: Line;
    private boundingLine: BoundingLine = new BoundingLine(Vector.origin(), Vector.origin());

    constructor(
        public from: Connectable,
        public to: Connectable,
        public type: LineType = LineType.UNIDIRECTIONAL,
        public branch: LineBranch = LineBranch.Y_FIRST
    ) {
        this.line = this.calculateLine();
    }

    render(context: CanvasRenderingContext2D): void {
        this.line.render(context);
    }

    get center(): Vector {
        return this.line!.from.add(this.line!.to).multiply(0.5);
    }

    get isHorizontal(): boolean {
        return this.line!.isHorizontal;
    }

    getBoundary(): Boundary {
        return this.boundingLine;
    }

    // this is a bit hacky, but it works
    public calculateLine(): Line {
        let from!: Vector;
        let to!: Vector;

        if (this.from.getBoundary() instanceof ConnectPoint) {
            from = this.from.getBoundary() as Vector;
        }

        if (this.to.getBoundary() instanceof ConnectPoint) {
            to = this.to.getBoundary() as Vector;
        }

        // For bounding boxes, first save the center points, then use a temporary line to calculate which directions
        // the ends of the line would point to connect to the box. Use the opposite direction to get the anchor point of the box.

        if (this.from.getBoundary() instanceof BoundingBox) {
            from = (this.from.getBoundary() as BoundingBox).center;
        }

        if (this.to.getBoundary() instanceof BoundingBox) {
            to = (this.to.getBoundary() as BoundingBox).center;
        }

        this.boundingLine = new BoundingLine(from, to);

        // only support connecting a line to another non line object
        if (
            this.from.getBoundary() instanceof BoundingLine &&
            to !== undefined &&
            !(this.to.getBoundary() instanceof BoundingLine)
        ) {
            from = (this.from.getBoundary() as BoundingLine).getConnectPoint(to);
        }

        if (
            this.to.getBoundary() instanceof BoundingLine &&
            from !== undefined &&
            !(this.from.getBoundary() instanceof BoundingLine)
        ) {
            to = (this.to.getBoundary() as BoundingLine).getConnectPoint(from);
        }

        if (from == undefined || to == undefined) {
            throw new Error('Cannot connect objects');
        }

        const temp = new Line(from, to);
        temp.branch = this.branch;

        if (this.from.getBoundary() instanceof BoundingBox) {
            from = (this.from.getBoundary() as BoundingBox).getConnectPoint(
                oppositeDirection(temp.fromTriangleDirection)
            );
        }

        if (this.to.getBoundary() instanceof BoundingBox) {
            to = (this.to.getBoundary() as BoundingBox).getConnectPoint(oppositeDirection(temp.toTriangleDirection));
        }

        const line = new Line(from, to);
        line.width = ConnectingLine.WIDTH;

        if (this.type === LineType.UNIDIRECTIONAL || this.type == LineType.BIDIRECTIONAL) {
            line.renderToTriangle = true;
        }

        if (this.type === LineType.BIDIRECTIONAL) {
            line.renderFromTriangle = true;
        }

        line.branch = this.branch;
        return line;
    }
}
