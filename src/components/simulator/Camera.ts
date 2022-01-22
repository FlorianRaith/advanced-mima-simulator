import { Point } from '@/components/simulator/utils';
import { CanvasWindow } from '@/components/simulator/Renderer';

export interface Camera {
    offset: Point;
    scale: number;
    windowScale: number;
}

export class CameraCalculator {
    static readonly SCALE_SENSITIVITY = 0.1;

    private startPan: Point = { x: 0, y: 0 };
    private panning: boolean = false;

    constructor(private canvas: HTMLCanvasElement, private camera: Camera) {}

    public startPanning(e: MouseEvent) {
        e.preventDefault();
        this.startPan = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        };
        this.panning = true;
    }

    public stopPanning(e: MouseEvent) {
        e.preventDefault();
        this.panning = false;
    }

    public onMouseMove(e: MouseEvent) {
        e.preventDefault();

        if (!this.panning) {
            return;
        }

        this.camera.offset.x +=
            (e.clientX - this.canvas.offsetLeft - this.startPan.x) / (this.camera.scale * this.camera.windowScale);
        this.camera.offset.y +=
            (e.clientY - this.canvas.offsetTop - this.startPan.y) / (this.camera.scale * this.camera.windowScale);

        this.startPan = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        };
    }

    public resetView(window: CanvasWindow) {
        this.camera.offset = {
            x: window.width / 2 / this.camera.windowScale,
            y: window.height / 2 / this.camera.windowScale,
        };

        this.camera.scale = 1;
    }

    public onScroll(e: WheelEvent) {
        e.preventDefault();

        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;

        const [mouseBeforeZoomX, mouseBeforeZoomY] = this.toWorldPosition(mouseX, mouseY);

        if (e.deltaY > 0) {
            this.camera.scale *= 1 - CameraCalculator.SCALE_SENSITIVITY;
        } else {
            this.camera.scale *= 1 + CameraCalculator.SCALE_SENSITIVITY;
        }

        const [mouseAfterZoomX, mouseAfterZoomY] = this.toWorldPosition(mouseX, mouseY);

        this.camera.offset.x -= mouseBeforeZoomX - mouseAfterZoomX;
        this.camera.offset.y -= mouseBeforeZoomY - mouseAfterZoomY;
    }

    private toWorldPosition(mouseX: number, mouseY: number) {
        return [
            mouseX / (this.camera.scale * this.camera.windowScale) - this.camera.offset.x,
            mouseY / (this.camera.scale * this.camera.windowScale) - this.camera.offset.y,
        ];
    }
}
