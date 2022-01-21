<template>
  <div class="flex flex-col items-center">
    <div class="border-8 border-primary-600 rounded-md w-full max-w-screen-xl">
      <canvas
        class="w-full max-w-screen-xl"
        ref="canvas"
        id="canvas"
        @mousedown="startPanning"
        @mouseup="stopPanning"
        @mousemove="onMouseMove"
        @mouseleave="stopPanning"
        @wheel="onScroll"
      >
      </canvas>
    </div>
    <div class="max-w-screen-xl w-full mt-3">
      <p></p>
      <div>
        <Button @click="resetView">reset view</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button';
import renderer from '@/components/simulator/renderer';
import zoomAndPan from '@/components/simulator/zoomAndPan';

export default {
  name: 'Simulator',
  components: {
    Button,
  },
  data: () => ({
    width: 0,
    height: 0,
    context: null,
    resizeObserver: null,

    ...renderer.data,
    ...zoomAndPan.data,
  }),
  mounted() {
    const canvas = this.$refs.canvas;
    this.context = canvas.getContext('2d');
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(canvas);
    this.onResize();
    this.shouldRender = true;
    this.resetView();
    requestAnimationFrame(this.render);
  },
  beforeUnmount() {
    this.shouldRender = false;
    this.resizeObserver.unobserve(this.$refs.canvas);
  },
  methods: {
    onResize() {
      const canvas = this.$refs.canvas;

      this.width = canvas.clientWidth;
      this.height = canvas.clientHeight;
      canvas.width = this.width;
      canvas.height = this.height;
    },

    floor2(value) {
      return Math.floor(value * 100) / 100;
    },

    ...renderer.methods,
    ...zoomAndPan.methods,
  },
};
</script>
