<template>
  <div>
    <button class="button-start" @click="start">开始</button>
    <button class="button-stop" @click="stop">停止</button>
    <canvas class="canvas-star" ref="canvas"></canvas>
    <div ref="svg-continer"></div>
  </div>
</template>

<script>
import { PlayStar } from "../assets/js/Star";

export default {
  name: "Star",
  data() {
    return {
      canvasPlayStar: undefined,
      svgPlayStar: undefined
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.canvasPlayStar = new PlayStar(this.$refs.canvas, {
        type: "canvas",
        centerCoordinate: [200, 200],
        radius: 100,
        count: 5,
        duration: 10000
      });
      this.canvasPlayStar.autoPlay(true);
      this.svgPlayStar = new PlayStar(this.$refs["svg-continer"], {
        type: "svg",
        centerCoordinate: [200, 200],
        radius: 100,
        count: 5,
        duration: 10000
      });
      this.svgPlayStar.autoPlay(true);
    },
    start() {
      this.canvasPlayStar.start();
      this.svgPlayStar.start();
    },
    stop() {
      this.canvasPlayStar.stop();
      this.svgPlayStar.stop();
    }
  }
};
</script>

<style scoped>
.canvas-star {
  height: 400px;
  width: 400px;
}
.button-start {
  position: absolute;
}
.button-stop {
  position: absolute;
  left: 50px;
}
</style>
