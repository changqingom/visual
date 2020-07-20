import { SVG } from "@svgdotjs/svg.js";
export class PlayStar {
  constructor(element, { type, centerCoordinate, radius, count, duration }) {
    this._type = type;
    this._autoPlay = false;
    this._centerCoordinate = centerCoordinate;
    this._radius = radius;
    this._renderer;
    this._count = count;
    if (count < 3 || count % 2 === 0) {
      throw new Error("边数错误");
    }
    this._coordinates = [];
    this._duration = duration;
    this._rotateDegress = 0;

    this._initElement(element);

    this._initCoordinates();
    this._getRenderer();
    this._render();
  }
  _initElement(element) {
    if (!(element instanceof HTMLElement)) {
      element = document.getElementById(element);
    }
    this._element = element;
  }
  _getRenderer() {
    switch (this._type) {
      case "canvas":
        this._renderer = new canvasRenderer(this);
        break;
      case "svg":
        this._renderer = new svgRenderer(this);
        break;
      default:
        throw new Error("类型错误");
    }
  }
  _render() {
    this._renderer.render();
  }
  _initCoordinates() {
    this._coordinates = [];
    for (let index = 0; index < this._count; index++) {
      const [x, y] = this._centerCoordinate;
      let temX =
        Math.cos(((360 / this._count) * index * Math.PI) / 180) * this._radius +
        x;
      let temY =
        Math.sin(((360 / this._count) * index * Math.PI) / 180) * this._radius +
        y;
      this._coordinates.push([temX, temY]);
    }
  }
  autoPlay(flag) {
    this._autoPlay = flag;
    if (this._autoPlay) {
      this._render();
    }
  }
  start() {
    if (!this._autoPlay) {
      this._autoPlay = true;
      this._render();
    }
  }
  stop() {
    this._autoPlay = false;
  }
}

class canvasRenderer {
  constructor(star) {
    this._star = star;
    this._star._element.height = this._star._element.offsetHeight;
    this._star._element.width = this._star._element.offsetWidth;
    this._ctx = this._star._element.getContext("2d");
    this._time = 0;
  }
  render(time = 0) {
    this._ctx.translate(
      this._star._centerCoordinate[0],
      this._star._centerCoordinate[1]
    );
    if (time !== 0) {
      this._star._rotateDegress +=
        360 * ((time - this._time) / this._star._duration);
    }

    this._ctx.rotate((this._star._rotateDegress * Math.PI) / 180);
    this._ctx.translate(
      -this._star._centerCoordinate[0],
      -this._star._centerCoordinate[1]
    );

    this._ctx.clearRect(
      0,
      0,
      this._star._element.width,
      this._star._element.height
    );

    this._ctx.beginPath();

    for (let i = 0; i < this._star._count; i++) {
      if (i === 0) {
        this._ctx.moveTo(...this._star._coordinates[i]);
      }
      this._ctx.lineTo(
        ...this._star._coordinates[
          2 * i >= this._star._count ? 2 * i - this._star._count : 2 * i
        ]
      );
    }

    this._ctx.closePath();

    this._ctx.stroke();

    this._ctx.setTransform(1, 0, 0, 1, 0, 0);

    this._time = time;
    if (this._star._autoPlay) {
      requestAnimationFrame(this.render.bind(this));
    }
  }
}
class svgRenderer {
  constructor(star) {
    this._star = star;

    this._time = 0;

    this._svg;
    this._polyline;
    this._initSVG();
  }
  _initSVG() {
    this._svg = SVG()
      .addTo(this._star._element)
      .size(600, 600);
    let polylineStr = "";
    for (let i = 0; i < this._star._count; i++) {
      if (i === 0) {
        polylineStr += this._star._coordinates[i];
      }
      polylineStr +=
        " " +
        this._star._coordinates[
          2 * i >= this._star._count ? 2 * i - this._star._count : 2 * i
        ];
    }
    polylineStr += " " + this._star._coordinates[0];
    this._polyline = this._svg.polyline(polylineStr);
    this._polyline.fill("none");
    this._polyline.stroke({
      color: "#000",
      width: 1,
    });
  }
  render(time = 0) {
    if (time !== 0) {
      this._star._rotateDegress =
        360 * ((time - this._time) / this._star._duration);
    }

    this._polyline.rotate(
      this._star._rotateDegress,
      this._star._centerCoordinate[0],
      this._star._centerCoordinate[1]
    );

    this._time = time;
    if (this._star._autoPlay) {
      requestAnimationFrame(this.render.bind(this));
    }
  }
}
