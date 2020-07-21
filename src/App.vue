<template>
  <div id="app">
    <h3>图像绘制</h3>
    <CanvasImage />
    <hr />
    <h3>五角星</h3>
    <Star />
    <hr />
    <h3>柱状图</h3>
    <Bar />
  </div>
</template>

<script>
import CanvasImage from "./components/CanvasImage";
import Star from "./components/Star";
import Bar from "./components/Bar";

export default {
  name: "App",
  components: {
    CanvasImage,
    Star,
    Bar
  }
};
</script>

<style>
</style>
