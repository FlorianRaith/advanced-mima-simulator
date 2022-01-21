import { color } from '@/components/simulator/utils';

export default {
  data: {
    shouldRender: false,
  },
  methods: {
    render() {
      if (!this.shouldRender) {
        return;
      }

      const ctx = this.context;
      ctx.clearRect(0, 0, this.width, this.height);

      renderGrid(ctx, this.width, this.height, 50, color('primary-100'));

      ctx.save();
      ctx.scale(this.scale, this.scale);
      ctx.translate(this.offset.x, this.offset.y);

      ctx.beginPath();
      ctx.rect(-50, -50, 100, 100);
      ctx.fillStyle = color('secondary-800');
      ctx.fill();

      ctx.restore();
      requestAnimationFrame(this.render);
    },
  },
};

function renderGrid(ctx, wdith, height, gap, color) {
  ctx.beginPath();
  for (let x = 0; x < wdith; x += gap) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += gap) {
    ctx.moveTo(0, y);
    ctx.lineTo(wdith, y);
  }

  ctx.strokeStyle = color;
  ctx.stroke();
}
