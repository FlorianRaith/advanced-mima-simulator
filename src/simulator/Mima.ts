import { RenderPipeline } from '@/engine/Renderer';
import Register from '@/simulator/Register';
import Bus, { BusNetwork } from '@/simulator/Bus';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';
import { LineType } from '@/engine/lines/ConnectingLine';

export default class Mima {
    private static readonly px = -200;
    private static readonly py = -250;
    private static readonly gapX = 350;
    private static readonly gapY = 80;

    private readonly akkumulator: Register;
    private readonly instructionAddressRegister: Register;
    private readonly oneRegister: Register;
    private readonly instructionRegister: Register;
    private readonly z: Register;
    private readonly x: Register;
    private readonly y: Register;
    private readonly memoryAddressRegister: Register;
    private readonly memoryDataRegister: Register;
    private readonly readRegister: Register;
    private readonly writeRegister: Register;

    private readonly allRegisters: Register[] = [];
    private readonly busNetwork: Bus[] = [];

    private readonly mainBus: Bus;

    private actions: (() => void)[] = [];
    private ticker: number = -1;

    constructor(private readonly renderPipeline: RenderPipeline) {
        // register registers
        this.akkumulator = this.createRegisterRelatively('Akku', 6, 0, 0);
        this.instructionAddressRegister = this.createRegisterRelatively('IAR', 5, 1, 0);
        this.oneRegister = this.createRegisterRelatively('1', 6, 0, 1);
        this.instructionRegister = this.createRegisterRelatively('IR', 6, 1, 1);
        this.z = this.createRegisterRelatively('Z', 6, 1, 2);
        this.x = this.createRegisterRelatively('X', 6, 0.75, 4.5);
        this.y = this.createRegisterRelatively('Y', 6, 1.3, 5.1);
        this.memoryAddressRegister = this.createRegisterRelatively('SAR', 5, 0, 6);
        this.memoryDataRegister = this.createRegisterRelatively('SDR', 6, 0.75, 6);
        this.readRegister = this.createRegisterRelatively('R', 1, 1.23, 6);
        this.writeRegister = this.createRegisterRelatively('W', 1, 1.37, 6);

        // register main bus
        this.renderPipeline.add(
            (this.mainBus = new Bus(
                24,
                new ConnectPoint(Mima.px + Mima.gapX * 0.4, Mima.py - 30),
                new ConnectPoint(Mima.px + Mima.gapX * 0.4, Mima.py + Mima.gapY * 6.5),
                LineType.BIDIRECTIONAL,
                true
            ))
        );

        // register bus network
        this.registerBus(24, this.akkumulator, this.mainBus, LineType.BIDIRECTIONAL);
        this.registerBus(20, this.instructionAddressRegister, this.mainBus, LineType.BIDIRECTIONAL);
        this.registerBus(24, this.oneRegister, this.mainBus);
        this.registerBus(24, this.instructionRegister, this.mainBus, LineType.BIDIRECTIONAL);
        this.registerBus(24, this.z, this.mainBus);
        this.registerBus(24, this.mainBus, this.x);
        this.registerBus(24, this.mainBus, this.y);
        this.registerBus(20, this.mainBus, this.memoryAddressRegister);
        this.registerBus(24, this.mainBus, this.memoryDataRegister, LineType.BIDIRECTIONAL);
        this.registerBus(20, this.memoryAddressRegister, new ConnectPoint(Mima.px, Mima.py + Mima.gapY * 7));

        this.oneRegister.value = 1;
        this.memoryDataRegister.value = 23452;

        setInterval(this.tick.bind(this), 1000);
        this.read();
        this.write();

        this.actions.push(() => {
            this.akkumulator.read();
            this.memoryDataRegister.write();
            this.instructionRegister.read();
        });
    }

    public shutdown(): void {
        clearInterval(this.ticker);
    }

    public tick() {
        const action = this.actions.pop();
        if (action) {
            action();
        }

        if (this.readRegister.value !== 0) {
            this.readRegister.value = (this.readRegister.value + 1) % 4;
        }

        if (this.writeRegister.value !== 0) {
            this.writeRegister.value = (this.writeRegister.value + 1) % 4;
        }

        for (const bus of this.busNetwork) {
            bus.tick(this);
        }

        this.mainBus.tick(this);

        for (const register of this.allRegisters) {
            register.tick(this);
        }
    }

    public read() {
        this.readRegister.value = 1;
    }

    get isReading(): boolean {
        return this.readRegister.value !== 0;
    }

    public write() {
        this.writeRegister.value = 1;
    }

    get isWriting(): boolean {
        return this.writeRegister.value !== 0;
    }

    private createRegisterRelatively(name: string, size: number, xOffset: number, yOffset: number): Register {
        const register = new Register(Mima.px + Mima.gapX * xOffset, Mima.py + Mima.gapY * yOffset, name, size);
        this.renderPipeline.addAll(register);
        this.allRegisters.push(register);
        return register;
    }

    private registerBus(
        size: number,
        from: BusNetwork | ConnectPoint,
        to: BusNetwork | ConnectPoint,
        type: LineType = LineType.UNIDIRECTIONAL
    ): Bus {
        const bus = new Bus(size, from, to, type);
        this.busNetwork.push(bus);
        this.renderPipeline.add(bus);
        return bus;
    }
}
