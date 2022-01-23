import { Camera } from '@/engine/Camera';
import { CanvasWindow } from '@/engine/Renderer';

export class Resizer {
    private listener: any = null;

    constructor(private canvas: HTMLCanvasElement, private window: CanvasWindow, private camera: Camera) {}

    public scale() {
        this.camera.windowScale = this.window.width / 1200;
    }

    public startListening() {
        this.listener = this.onResize.bind(this);
        window.addEventListener('resize', this.listener);
    }

    public stopListening() {
        window.removeEventListener('resize', this.listener);
    }

    public onResize() {
        this.scale();
        const newWidth = this.canvas.clientWidth;
        const newHeight = this.canvas.clientHeight;

        this.window.width = this.canvas.width = newWidth;
        this.window.height = this.canvas.height = newHeight;
    }
}
