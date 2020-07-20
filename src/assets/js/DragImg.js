export class DragImg {
  constructor(element, { url, centerCoordinate }) {
    this._url = url;
    this._ready = false;
    this._bitMap;
    this._centerCoordinate = centerCoordinate;
    this._resolution = 1;
    this._rotateOrigin = [0, 0];
    this._rotateDegress = 0;

    this._initElement(element);
    
    this._loadImage().then(this._drawImage.bind(this));
  }
  _initElement(element) {
    if (!(element instanceof HTMLCanvasElement)) {
      element = document.getElementById(element);
    }

    this._element = element;
    this._resize({
      height: this._element.offsetHeight,
      width: this._element.offsetWidth,
    });
    this._ctx = this._element.getContext("2d");
  }
  _resize({ width, height }) {
    this._element.height = height;
    this._element.width = width;
  }
  _loadImage() {
    return fetch(this._url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return createImageBitmap(blob);
      })
      .then((bitMap) => {
        this._bitMap = bitMap;
        this._ready = true;
        return;
      })
      .catch((err) => {
        this._ready = false;
        console.error(err);
      });
  }
  _drawImage() {
    if (this._ready) {
      this._ctx.translate(this._rotateOrigin[0], this._rotateOrigin[1]);
      this._ctx.rotate((this._rotateDegress * Math.PI) / 180);
      this._ctx.translate(-this._rotateOrigin[0], -this._rotateOrigin[1]);

      this._ctx.clearRect(0, 0, this._element.width, this._element.height);

      this._ctx.drawImage(
        this._bitMap,
        this._centerCoordinate[0] - (this._bitMap.width * this._resolution) / 2,
        this._centerCoordinate[1] -
          (this._bitMap.height * this._resolution) / 2,
        this._bitMap.width * this._resolution,
        this._bitMap.height * this._resolution
      );

      this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  _zoom(resolution) {
    this._resolution = resolution;
    this._drawImage();
  }
  _rotate(rotateOrigin, rotateDegress) {
    this._rotateOrigin = rotateOrigin;
    this._rotateDegress = rotateDegress;
    this._drawImage();
  }
  zoomBig(resolution) {
    this._zoom(resolution);
  }
  zoomSmall(resolution) {
    this._zoom(resolution);
  }
  rotate(rotateOrigin, rotateDegress) {
    this._rotate(rotateOrigin, rotateDegress);
  }
}
