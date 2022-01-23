import { color } from '@/simulator/utils';
import { Camera } from '@/engine/Camera';

export interface CanvasWindow {
    width: number;
    height: number;
}

export interface Renderable {
    render(context: CanvasRenderingContext2D): void;
}

export class RenderPipeline {
    public pipeline: Renderable[] = [];

    public add(renderable: Renderable) {
        this.pipeline.push(renderable);
    }
}

export class Renderer {
    public readonly pipeline = new RenderPipeline();
    private shouldRender = false;

    constructor(private context: CanvasRenderingContext2D, private window: CanvasWindow, private camera: Camera) {}

    public start() {
        this.shouldRender = true;
        requestAnimationFrame(this.render.bind(this));
    }

    public stop() {
        this.shouldRender = false;
    }

    public render() {
        if (!this.shouldRender) {
            return;
        }

        const ctx = this.context;
        ctx.clearRect(0, 0, this.window.width, this.window.height);

        this.renderGrid(50 * this.camera.windowScale, color('primary-100'));

        ctx.save();
        ctx.scale(this.camera.scale * this.camera.windowScale, this.camera.scale * this.camera.windowScale);
        ctx.translate(this.camera.offset.x, this.camera.offset.y);

        ctx.font =
            '14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

        // ctx.strokeStyle = 'red';
        // ctx.beginPath();
        // ctx.moveTo(-this.window.width / 2, 0);
        // ctx.lineTo(this.window.width / 2, 0);
        // ctx.stroke();
        //
        // ctx.strokeStyle = 'blue';
        // ctx.beginPath();
        // ctx.moveTo(0, -this.window.height / 2);
        // ctx.lineTo(0, this.window.height / 2);
        // ctx.stroke();

        for (const object of this.pipeline.pipeline) {
            object.render(ctx);
        }

        ctx.restore();
        requestAnimationFrame(this.render.bind(this));
    }

    private renderGrid(gap: number, color: string) {
        this.context.beginPath();
        for (let x = 0; x < this.window.width; x += gap) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.window.height);
        }
        for (let y = 0; y < this.window.height; y += gap) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.window.width, y);
        }

        this.context.strokeStyle = color;
        this.context.stroke();
    }
}
