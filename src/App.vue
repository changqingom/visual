<template>
  <div id="app">
    <h3>图像绘制</h3>
    <CanvasImage />
    <hr>
    <h3>五角星</h3>
    <Star />
  </div>
</template>

<script>
import CanvasImage from "./components/CanvasImage";
import Star from "./components/Star";

export default {
  name: "App",
  components: {
    CanvasImage,
    Star
  }
};
</script>

<style>
</style>
