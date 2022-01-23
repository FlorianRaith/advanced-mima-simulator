import { RenderPipeline } from '@/engine/Renderer';
import Mima from '@/simulator/Mima';
import Controller from '@/engine/Controller';

export default class Simulator extends Controller {
    create(renderPipeline: RenderPipeline): void {
        const mima = new Mima(renderPipeline);
        mima.start();
    }

    destroy(): void {}
}
