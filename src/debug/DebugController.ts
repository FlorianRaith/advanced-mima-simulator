import Controller from '@/engine/Controller';
import { RenderPipeline } from '@/engine/Renderer';
import Rectangle from '@/debug/Rectangle';

export default class DebugController extends Controller {
    create(renderPipeline: RenderPipeline): void {
        const rect = new Rectangle(-50, -50, 100, 100);
        renderPipeline.add(rect);
    }

    destroy(): void {}
}
