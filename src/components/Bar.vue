<template>
  <div>
    <canvas class="canvas-bar" id="canvas-bar" ref="canvas"></canvas>
  </div>
</template>

<script>
import { Bar3d } from "../assets/js/Bar";

export default {
  name: "Star",
  data() {
    return {
      bar3d: undefined
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.bar3d = new Bar3d({
        rotate: { x: 15, y: 30 },
        color: "#7cb5ec",
        element: this.$refs.canvas
      });
      const data = [2, 3, null, 4, 0, 5, 1, 4, 6, 3];
      this.bar3d.setData(data);
    }
  }
};
</script>

<style scoped>
.canvas-bar {
  height: 600px;
  width: 600px;
}
</style>
