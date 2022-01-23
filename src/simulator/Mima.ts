import { RenderPipeline } from '@/engine/Renderer';
import Register from '@/simulator/Register';
import Bus from '@/simulator/Bus';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';
import { LineType } from '@/engine/lines/ConnectingLine';

export default class MIMA {
    private readonly akkumulator: Register;
    private readonly instructionAddressRegister: Register;
    private readonly oneRegister: Register;
    private readonly instructionRegister: Register;
    private readonly z: Register;
    private readonly x: Register;
    private readonly y: Register;
    private readonly memoryAddressRegister: Register;
    private readonly memoryDataRegister: Register;
    private readonly read: Register;
    private readonly write: Register;

    private readonly mainBus: Bus;

    constructor(private readonly renderPipeline: RenderPipeline) {
        const px = -200;
        const py = -250;
        const gapX = 350;
        const gapY = 80;

        this.akkumulator = new Register(px, py, 'Akku', 6);
        this.instructionAddressRegister = new Register(px + gapX, py, 'IAR', 5);
        this.oneRegister = new Register(px, py + gapY, '1', 6);
        this.instructionRegister = new Register(px + gapX, py + gapY, 'IR', 6);
        this.z = new Register(px + gapX, py + gapY * 2, 'Z', 6);
        this.x = new Register(px + gapX * 0.75, py + gapY * 4.5, 'X', 6);
        this.y = new Register(px + gapX * 1.3, py + gapY * 5.1, 'Y', 6);
        this.memoryAddressRegister = new Register(px, py + gapY * 6, 'SAR', 5);
        this.memoryDataRegister = new Register(px + gapX * 0.75, py + gapY * 6, 'SDR', 6);
        this.read = new Register(px + gapX * 1.23, py + gapY * 6, 'R', 1);
        this.write = new Register(px + gapX * 1.37, py + gapY * 6, 'W', 1);

        this.mainBus = new Bus(
            24,
            new ConnectPoint(px + gapX * 0.4, py - 30),
            new ConnectPoint(px + gapX * 0.4, py + gapY * 6.5),
            LineType.BIDIRECTIONAL
        );
    }

    public start() {
        setInterval(() => {
            this.akkumulator.value = Math.floor(Math.random() * 64);
        }, 1000);

        this.oneRegister.value = 1;

        this.registerBus();
        this.renderRegisters();
    }

    private registerBus(): void {
        this.renderPipeline.addAll(
            new Bus(24, this.akkumulator, this.mainBus, LineType.BIDIRECTIONAL),
            new Bus(20, this.instructionAddressRegister, this.mainBus, LineType.BIDIRECTIONAL),
            new Bus(24, this.oneRegister, this.mainBus),
            new Bus(24, this.instructionRegister, this.mainBus, LineType.BIDIRECTIONAL),
            new Bus(24, this.z, this.mainBus),
            new Bus(24, this.mainBus, this.x),
            new Bus(24, this.mainBus, this.y),
            new Bus(20, this.mainBus, this.memoryAddressRegister),
            new Bus(24, this.mainBus, this.memoryDataRegister, LineType.BIDIRECTIONAL)
        );
        // this.connectBoth(this.akkumulator, this.mainBus, 24, Orientation.HORIZONTAL);
        // this.connectBoth(this.instructionAddressRegister, this.mainBus, 20, Orientation.HORIZONTAL);
        // this.connect(this.oneRegister, this.mainBus, 24, Orientation.HORIZONTAL);
        // this.connectBoth(this.instructionRegister, this.mainBus, 24, Orientation.HORIZONTAL);
        // this.connect(this.z, this.mainBus, 24, Orientation.HORIZONTAL);
        // this.connect(this.mainBus, this.x, 24, Orientation.HORIZONTAL);
        // this.connect(this.mainBus, this.y, 24, Orientation.HORIZONTAL);
        // this.connect(this.mainBus, this.memoryAddressRegister, 20, Orientation.HORIZONTAL);
        // this.connectBoth(this.mainBus, this.memoryDataRegister, 24, Orientation.HORIZONTAL);
        // this.connectBoth(this.memoryAddressRegister, this.oneRegister, 24, Orientation.VERTICAL);
    }

    private renderRegisters(): void {
        this.renderPipeline.add(this.akkumulator);
        this.renderPipeline.add(this.instructionAddressRegister);
        this.renderPipeline.add(this.oneRegister);
        this.renderPipeline.add(this.instructionRegister);
        this.renderPipeline.add(this.z);
        this.renderPipeline.add(this.x);
        this.renderPipeline.add(this.y);
        this.renderPipeline.add(this.memoryAddressRegister);
        this.renderPipeline.add(this.memoryDataRegister);
        this.renderPipeline.add(this.read);
        this.renderPipeline.add(this.write);

        this.renderPipeline.add(this.mainBus);
    }

    // private connect(from: Connectable, to: Connectable, size: number, direction: Orientation): Bus {
    //     const bus = new Bus(size, direction);
    //
    //     bus.connectInput(from);
    //     bus.connectOutput(to);
    //
    //     from.connectOutput(bus);
    //     to.connectInput(bus);
    //
    //     if (from instanceof Bus) {
    //         bus.renderStartConnectable = to;
    //         bus.renderEndConnectable = from;
    //         bus.renderStartTriangle = true;
    //     } else {
    //         bus.renderStartConnectable = from;
    //         bus.renderEndConnectable = to;
    //         bus.renderEndTriangle = true;
    //     }
    //     bus.calculateRenderPoints();
    //
    //     this.renderPipeline.add(bus);
    //
    //     return bus;
    // }
    //
    // private connectBoth(from: Bus | Register, to: Bus | Register, size: number, direction: Orientation): Bus {
    //     const bus = this.connect(from, to, size, direction);
    //
    //     bus.renderStartTriangle = true;
    //     bus.renderEndTriangle = true;
    //
    //     bus.connectInput(to);
    //     bus.connectOutput(from);
    //
    //     from.connectInput(bus);
    //     to.connectOutput(bus);
    //
    //     return bus;
    // }
}
