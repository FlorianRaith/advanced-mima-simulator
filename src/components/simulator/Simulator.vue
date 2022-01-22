<template>
    <div class="flex flex-col items-center">
        <div class="border-8 border-primary-600 rounded-md w-full max-w-screen-xl">
            <canvas
                class="w-full max-w-screen-xl"
                ref="canvas"
                id="canvas"
                @mousedown="cameraCalculator.startPanning"
                @mouseup="cameraCalculator.stopPanning"
                @mousemove="cameraCalculator.onMouseMove"
                @mouseleave="cameraCalculator.stopPanning"
                @wheel="cameraCalculator.onScroll"
            >
            </canvas>
        </div>
        <div class="max-w-screen-xl w-full mt-3">
            <p></p>
            <div>
                <Button @click="cameraCalculator.resetView(window)">reset view</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Renderer, CanvasWindow } from '@/components/simulator/Renderer';
import Button from '@/components/Button.vue';
import { Camera, CameraCalculator } from '@/components/simulator/Camera';

@Options({
    components: {
        Button,
    },
})
export default class Simulator extends Vue {
    private window: CanvasWindow = {
        width: 0,
        height: 0,
    };

    private camera: Camera = {
        offset: { x: 0, y: 0 },
        scale: 1,
    };

    private context?: CanvasRenderingContext2D = undefined;
    private renderer?: Renderer = undefined;
    private cameraCalculator?: CameraCalculator = undefined;

    mounted() {
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        this.context = canvas.getContext('2d')!;

        this.window.width = canvas.clientWidth;
        this.window.height = canvas.clientHeight;
        canvas.width = this.window.width;
        canvas.height = this.window.height;

        this.renderer = new Renderer(this.context, this.window, this.camera);
        this.renderer.start();

        this.cameraCalculator = new CameraCalculator(canvas, this.camera);
        this.cameraCalculator.resetView(this.window);
    }

    beforeUnmount() {
        this.renderer!.stop();
    }
}
</script>
