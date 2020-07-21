<template>
  <div>
    <canvas class="canvas-bar" id="canvas-bar" ref="canvas"></canvas>
  </div>
</template>

<script>
// import "../assets/js/Bar";

export default {
  name: "Star",
  data() {
    return {
      canvasPlayStar: undefined,
      svgPlayStar: undefined
    };
  },
  mounted() {
    import("../assets/js/Bar");
  },
  methods: {
    init() {},
    start() {},
    stop() {}
  }
};
</script>

<style scoped>
.canvas-bar {
  height: 600px;
  width: 600px;
}
</style>
