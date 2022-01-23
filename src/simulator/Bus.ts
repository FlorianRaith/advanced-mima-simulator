import { Renderable } from '@/engine/Renderer';
import ConnectingLine, { Connectable, LineType } from '@/engine/lines/ConnectingLine';
import { Boundary } from '@/engine/lines/Boundary';
import { color } from '@/engine/utils';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';

export interface BusNetwork extends Connectable {
    addOutput(obj: BusNetwork): void;
    addInput(obj: BusNetwork): void;
}

export default class Bus implements Renderable, BusNetwork {
    constructor(
        public readonly size: number,
        public readonly from: BusNetwork | ConnectPoint,
        public readonly to: BusNetwork | ConnectPoint,
        public readonly type: LineType = LineType.UNIDIRECTIONAL
    ) {
        this.line = new ConnectingLine(from, to, type);

        if (!(from instanceof ConnectPoint)) {
            from.addOutput(this);
            this.addInput(from);
        }

        if (!(to instanceof ConnectPoint)) {
            to.addInput(this);
            this.addOutput(to);
        }

        if (type === LineType.BIDIRECTIONAL && !(from instanceof ConnectPoint)) {
            from.addInput(this);
            this.addOutput(from);
        }

        if (type === LineType.BIDIRECTIONAL && !(to instanceof ConnectPoint)) {
            to.addOutput(this);
            this.addInput(to);
        }
    }

    private line: ConnectingLine;

    private inputs: BusNetwork[] = [];
    private outputs: BusNetwork[] = [];

    public addOutput(obj: BusNetwork): void {
        this.outputs.push(obj);
    }

    public addInput(obj: BusNetwork): void {
        this.inputs.push(obj);
    }

    render(context: CanvasRenderingContext2D): void {
        this.line.render(context);

        const center = this.line.center;

        // middle
        context.beginPath();
        context.strokeStyle = color('secondary-600');
        context.lineWidth = 2;
        context.moveTo(center.x - 12, center.y + 12);
        context.lineTo(center.x + 12, center.y - 12);
        context.stroke();

        context.fillStyle = color('secondary-600');
        if (this.line.isHorizontal) {
            context.fillText(this.size + '', center.x - 4, center.y + 15);
        } else {
            context.fillText(this.size + '', center.x + 4, center.y + 9);
        }
    }

    getBoundary(): Boundary {
        return this.line.getBoundary();
    }
}
