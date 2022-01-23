import { Renderable } from '@/engine/Renderer';
import { color } from '@/engine/utils';

export default class Rectangle implements Renderable {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = color('secondary-400');
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
