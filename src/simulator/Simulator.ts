import { RenderPipeline } from '@/simulator/render/Renderer';
import Mima from '@/simulator/Mima';

export default class Simulator {
    constructor(private renderPipeline: RenderPipeline) {}

    public start() {
        const mima = new Mima(this.renderPipeline);
        mima.start();
    }
}
