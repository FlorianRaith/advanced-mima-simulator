import { RenderPipeline } from '@/engine/Renderer';

// lack of better name
export default abstract class Controller {
    public abstract create(renderPipeline: RenderPipeline): void;

    public abstract destroy(): void;
}
