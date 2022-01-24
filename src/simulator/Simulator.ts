import { RenderPipeline } from '@/engine/Renderer';
import Mima from '@/simulator/Mima';
import Controller from '@/engine/Controller';

export default class Simulator extends Controller {
    private mima?: Mima;

    create(renderPipeline: RenderPipeline): void {
        this.mima = new Mima(renderPipeline);
    }

    destroy(): void {
        this.mima?.shutdown();
    }
}
