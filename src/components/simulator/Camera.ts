import { Point } from '@/components/simulator/utils';
import { CanvasWindow } from '@/components/simulator/Renderer';

export interface Camera {
    offset: Point;
    scale: number;
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

        this.camera.offset.x += (e.clientX - this.canvas.offsetLeft - this.startPan.x) / this.camera.scale;
        this.camera.offset.y += (e.clientY - this.canvas.offsetTop - this.startPan.y) / this.camera.scale;

        this.startPan = {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        };
    }

    public resetView(window: CanvasWindow) {
        this.camera.offset = {
            x: window.width / 2,
            y: window.height / 2,
        };

        this.camera.scale = 1;
    }

    public onScroll(e: WheelEvent) {
        e.preventDefault();

        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;

        const mouseBeforeZoomX = mouseX / this.camera.scale - this.camera.offset.x;
        const mouseBeforeZoomY = mouseY / this.camera.scale - this.camera.offset.y;

        if (e.deltaY > 0) {
            this.camera.scale *= 1 - CameraCalculator.SCALE_SENSITIVITY;
        } else {
            this.camera.scale *= 1 + CameraCalculator.SCALE_SENSITIVITY;
        }

        const mouseAfterZoomX = mouseX / this.camera.scale - this.camera.offset.x;
        const mouseAfterZoomY = mouseY / this.camera.scale - this.camera.offset.y;

        this.camera.offset.x -= mouseBeforeZoomX - mouseAfterZoomX;
        this.camera.offset.y -= mouseBeforeZoomY - mouseAfterZoomY;
    }
}
