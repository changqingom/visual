<template>
  <div>
    <button @click="zoomBig">放大</button>
    <button @click="zoomSmall">缩小</button>
    <button @click="rotate">旋转</button>
    <canvas class="canvas-image" ref="canvas"></canvas>
  </div>
</template>

<script>
import { DragImg } from "../assets/js/DragImg";
export default {
  name: "CanvasImage",
  data() {
    return {
      dragImg: undefined,
      resolution: 1,
      degress: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.dragImg = new DragImg(this.$refs.canvas, {
        url: "/static/img/icon1.jpg",
        centerCoordinate: [300, 300]
      });
    },
    zoomBig() {
      this.resolution += 0.1;
      this.dragImg.zoomBig(this.resolution);
    },
    zoomSmall() {
      this.resolution -= 0.1;
      this.dragImg.zoomSmall(this.resolution);
    },
    rotate() {
      this.degress += 10;
      this.degress >= 360 && (this.degress = 0);
      this.dragImg.rotate([300, 300], this.degress);
    }
  }
};
</script>

<style scoped>
.canvas-image {
  height: 600px;
  width: 600px;
}
</style>
