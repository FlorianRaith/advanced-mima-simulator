const SCALE_SENSITIVITY = 0.1;

export default {
  data: {
    panning: false,
    offset: { x: 0, y: 0 },
    startPan: { x: 0, y: 0 },
    scale: 1,
  },
  methods: {
    startPanning(e) {
      e.preventDefault();
      const canvas = this.$refs.canvas;
      this.startPan = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
      };
      this.panning = true;
    },

    stopPanning(e) {
      e.preventDefault();
      this.panning = false;
    },

    onMouseMove(e) {
      e.preventDefault();
      const canvas = this.$refs.canvas;

      if (!this.panning) {
        return;
      }

      this.offset.x += (e.clientX - canvas.offsetLeft - this.startPan.x) / this.scale;
      this.offset.y += (e.clientY - canvas.offsetTop - this.startPan.y) / this.scale;

      this.startPan = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
      };
    },

    resetView() {
      this.offset = {
        x: this.width / 2,
        y: this.height / 2,
      };

      this.scale = 1;
    },

    onScroll(e) {
      e.preventDefault();
      const canvas = this.$refs.canvas;

      const mouseX = e.clientX - canvas.offsetLeft;
      const mouseY = e.clientY - canvas.offsetTop;

      const mouseBeforeZoomX = mouseX / this.scale - this.offset.x;
      const mouseBeforeZoomY = mouseY / this.scale - this.offset.y;

      if (e.deltaY > 0) {
        this.scale *= 1 - SCALE_SENSITIVITY;
      } else {
        this.scale *= 1 + SCALE_SENSITIVITY;
      }

      const mouseAfterZoomX = mouseX / this.scale - this.offset.x;
      const mouseAfterZoomY = mouseY / this.scale - this.offset.y;

      this.offset.x -= mouseBeforeZoomX - mouseAfterZoomX;
      this.offset.y -= mouseBeforeZoomY - mouseAfterZoomY;
    },
  },
};
