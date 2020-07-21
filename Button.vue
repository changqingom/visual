<template>
  <div>
    <button
      ref="button"
      :style="{'background-color': backColor}"
      :class="'button '+buttonSizeName"
      @click="buttonClick"
    >{{text}}</button>
  </div>
</template>

<script>
export default {
  name: "Button",
  data() {
    return {};
  },
  props: {
    size: {
      type: String,
      // "medium / small / mini"
      default: "medium"
    },
    color: {
      type: String,
      default: "blue"
    },
    text: {
      type: String,
      default: "button"
    }
  },
  computed: {
    backColor() {
      return this.color;
    },
    buttonSizeName() {
      return "button-size-" + this.size;
    }
  },
  methods: {
    buttonClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style>
.button {
  color: #fff;
}
.button-size-medium {
  height: 40px;
  width: 100px;
}
.button-size-small {
  height: 30px;
  width: 75px;
}
.button-size-mini {
  height: 20px;
  width: 50px;
}
</style>
