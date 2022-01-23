import { Renderable } from '@/engine/Renderer';
import { asBinaryString, color, Locatable, Point } from '@/simulator/utils';
import Bus, { Connectable, Direction } from '@/simulator/Bus';

export default class Register implements Renderable, Locatable, Connectable {
    private _value: number = 0;

    public output?: Bus = undefined;
    public input?: Bus = undefined;

    constructor(public x: number, public y: number, private name: string, private size: number) {}

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = Math.min(value, Math.pow(2, this.size) - 1);
    }

    public connectOutput(bus: Connectable): void {
        if (!(bus instanceof Bus)) {
            throw new Error('Cannot connect to non-bus');
        }

        this.output = bus;
    }

    public connectInput(bus: Connectable): void {
        if (!(bus instanceof Bus)) {
            throw new Error('Cannot connect to non-bus');
        }

        this.input = bus;
    }

    public getConnectPoint(direction: Direction): Point {
        if (direction === Direction.RIGHT) {
            return { x: this.x + (this.size * 25) / 2 + 0.5, y: this.y };
        }

        if (direction === Direction.LEFT) {
            return { x: this.x - (this.size * 25) / 2 - 0.5, y: this.y };
        }

        if (direction === Direction.UP) {
            return { x: this.x, y: this.y - 25.5 };
        }

        if (direction === Direction.DOWN) {
            return { x: this.x, y: this.y + 25.5 };
        }

        return { x: this.x, y: this.y };
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
        context.stroke();

        const nameOffset = this.size > 1 ? 15 : 9;
        context.fillStyle = color('secondary-600');
        context.fillText(this.name, this.x + nameOffset, this.y + 17);

        const binValue = asBinaryString(this._value);
        for (let i = 0; i < this.size; i++) {
            context.fillText(binValue[i - this.size + binValue.length] ?? '0', this.x + 25 * i + 9, this.y + 42);
        }

        if (this.size > 2) {
            const decValue = '(' + this._value + ')';
            const measure = context.measureText(decValue);
            context.fillText('(' + this._value + ')', this.x + this.size * 25 - measure.width - 10, this.y + 17);
        }

        context.restore();
    }
}
