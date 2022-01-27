import { Renderable } from '@/engine/Renderer';
import { asHexString, color, Direction, Locatable } from '@/engine/utils';
import { BoundingBox } from '@/engine/lines/Boundary';
import Vector from '@/engine/Vector';
import { BusNetwork } from '@/simulator/Bus';
import { DEBUG } from '@/debug/DebugController';
import Mima from '@/simulator/Mima';

export default class Register implements Renderable, Locatable, BusNetwork {
    private _value: number = 0;

    public output?: BusNetwork = undefined;
    public input?: BusNetwork = undefined;

    public reading: boolean = false;
    public writing: boolean = false;

    constructor(public x: number, public y: number, private name: string, private size: number) {}

    public tick(mima: Mima) {
        if (this.isActive()) {
            this.reading = false;
            this.writing = false;
        }
    }

    public read() {
        this.reading = true;
    }

    public write() {
        this.writing = true;
    }

    isActive(): boolean {
        return this.reading || this.writing;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = Math.min(value, Math.pow(2, this.size * 4) - 1);
    }

    public addOutput(obj: BusNetwork): void {
        this.output = obj;
    }

    public addInput(obj: BusNetwork): void {
        this.input = obj;
    }

    getBoundary(): BoundingBox {
        return new BoundingBox(
            new Vector(this.x + (-this.size * 25) / 2, this.y - 25),
            new Vector(this.x + this.size * 25 + (-this.size * 25) / 2, this.y + 25)
        );
    }

    public render(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate((-this.size * 25) / 2, -25);
        context.fillStyle = color('secondary-200');
        context.fillRect(this.x, this.y, 25 * this.size, 25 * 2);

        context.beginPath();
        context.rect(this.x, this.y, 25 * this.size, 25 * 2);

        for (let i = 0; i < this.size; i++) {
            context.moveTo(this.x + 25 * i, this.y + 25 * 2);
            context.lineTo(this.x + 25 * i, this.y + 25);
        }

        context.moveTo(this.x, this.y + 25);
        context.lineTo(this.x + this.size * 25, this.y + 25);

        context.strokeStyle = color('secondary-600');
        context.lineWidth = 1;
        context.stroke();

        const nameOffset = this.size > 1 ? 15 : 9;
        context.fillStyle = color('secondary-600');
        context.fillText(this.name, this.x + nameOffset, this.y + 17);

        const hexValue = asHexString(this._value);
        for (let i = 0; i < this.size; i++) {
            context.fillText(hexValue[i - this.size + hexValue.length] ?? '0', this.x + 25 * i + 9, this.y + 42);
        }

        context.restore();

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
}
