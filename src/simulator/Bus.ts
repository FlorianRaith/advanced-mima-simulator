import { Renderable } from '@/engine/Renderer';
import ConnectingLine, { Connectable, LineType } from '@/engine/lines/ConnectingLine';
import { Boundary } from '@/engine/lines/Boundary';
import { color } from '@/engine/utils';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';
import Mima from '@/simulator/Mima';

export interface BusNetwork extends Connectable {
    addOutput(obj: BusNetwork): void;
    addInput(obj: BusNetwork): void;
    isActive(): boolean;
}

export default class Bus implements Renderable, BusNetwork {
    public active: boolean = false;

    constructor(
        public readonly size: number,
        public readonly from: BusNetwork | ConnectPoint,
        public readonly to: BusNetwork | ConnectPoint,
        public readonly type: LineType = LineType.UNIDIRECTIONAL,
        private readonly isMain: boolean = false
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

    isActive(): boolean {
        return this.active;
    }

    public tick(mima: Mima) {
        if (this.isMain) {
            this.active = [...this.inputs, ...this.outputs].some((obj) => obj.isActive());
        } else {
            this.active = [...this.inputs, ...this.outputs]
                .filter((obj) => !(obj instanceof Bus))
                .some((obj) => obj.isActive());
        }
    }

    render(context: CanvasRenderingContext2D): void {
        if (this.active) {
            this.line.color = 'red-500';
        }

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
