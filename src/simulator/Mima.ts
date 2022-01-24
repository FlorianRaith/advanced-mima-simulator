import { RenderPipeline } from '@/engine/Renderer';
import Register from '@/simulator/Register';
import Bus from '@/simulator/Bus';
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
    private readonly read: Register;
    private readonly write: Register;

    private readonly mainBus: Bus;

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
        this.read = this.createRegisterRelatively('R', 1, 1.23, 6);
        this.write = this.createRegisterRelatively('W', 1, 1.37, 6);

        // register main bus
        this.renderPipeline.add(
            (this.mainBus = new Bus(
                24,
                new ConnectPoint(Mima.px + Mima.gapX * 0.4, Mima.py - 30),
                new ConnectPoint(Mima.px + Mima.gapX * 0.4, Mima.py + Mima.gapY * 6.5),
                LineType.BIDIRECTIONAL
            ))
        );

        // register bus network
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

        this.oneRegister.value = 1;
    }

    public shutdown(): void {}

    private createRegisterRelatively(name: string, size: number, xOffset: number, yOffset: number): Register {
        const register = new Register(Mima.px + Mima.gapX * xOffset, Mima.py + Mima.gapY * yOffset, name, size);
        this.renderPipeline.addAll(register);
        return register;
    }
}
