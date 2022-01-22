import { color } from '@/components/simulator/utils';
import { Camera } from '@/components/simulator/Camera';

export interface CanvasWindow {
    width: number;
    height: number;
}

export class Renderer {
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

        this.renderGrid(50, color('primary-100'));

        ctx.save();
        ctx.scale(this.camera.scale, this.camera.scale);
        ctx.translate(this.camera.offset.x, this.camera.offset.y);

        ctx.beginPath();
        ctx.rect(-50, -50, 100, 100);
        ctx.fillStyle = color('secondary-800');
        ctx.fill();

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
