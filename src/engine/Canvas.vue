<template>
    <div class="flex flex-col items-center">
        <div class="border-8 border-primary-600 rounded-md w-full max-w-screen-xl" @resize="resizer.onResize">
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
            <div>
                <Button @click="resetView">reset view</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CanvasWindow, Renderer } from '@/engine/Renderer';
import Button from '@/components/Button.vue';
import { Camera, CameraCalculator } from '@/engine/Camera';
import { Resizer } from '@/engine/Resizer';
import { Prop } from 'vue-property-decorator';
import Controller from '@/engine/Controller';
import { floor5 } from '@/engine/utils';

@Options({
    components: {
        Button,
    },
})
export default class Canvas extends Vue {
    private window: CanvasWindow = {
        width: 0,
        height: 0,
    };

    private camera: Camera = {
        offset: { x: 0, y: 0 },
        scale: 1,
        windowScale: 1,
    };

    @Prop({ type: Controller, required: true })
    private controller!: Controller;

    private renderer?: Renderer = undefined;
    private cameraCalculator?: CameraCalculator = undefined;
    private resizer?: Resizer = undefined;

    private historyUpdateInterval: number = 0;

    updateHistoryState() {
        history.pushState(
            {},
            '',
            this.$route.path +
                '#' +
                floor5(this.camera.offset.x) +
                ',' +
                floor5(this.camera.offset.y) +
                ',' +
                floor5(this.camera.scale)
        );
    }

    mounted() {
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;

        this.window.width = canvas.clientWidth;
        this.window.height = canvas.clientHeight;
        canvas.width = this.window.width;
        canvas.height = this.window.height;

        this.renderer = new Renderer(context, this.window, this.camera);
        this.renderer.start();

        this.resizer = new Resizer(canvas, this.window, this.camera);
        this.resizer.scale();
        this.resizer.startListening();

        this.cameraCalculator = new CameraCalculator(canvas, this.camera);
        this.cameraCalculator.resetView(this.window);

        this.controller.create(this.renderer.pipeline);

        this.extractCameraValues();
        this.historyUpdateInterval = setInterval(this.updateHistoryState.bind(this), 1000);
    }

    private extractCameraValues() {
        const hrefSplit = window.location.href.split('#');
        if (hrefSplit.length > 1) {
            const coords = hrefSplit[1].split(',');
            if (coords.length === 3) {
                this.camera.offset.x = parseFloat(coords[0]);
                this.camera.offset.y = parseFloat(coords[1]);
                this.camera.scale = parseFloat(coords[2]);
            }
        }
    }

    beforeUnmount() {
        clearInterval(this.historyUpdateInterval);
        this.renderer!.stop();
        this.resizer!.stopListening();
        this.controller.destroy();
    }

    resetView() {
        this.resizer!.scale();
        this.cameraCalculator!.resetView(this.window);
    }
}
</script>
