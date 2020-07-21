const glMatrix = require("./gl-matrix-min");

export class Bar3d {
  constructor(config) {
    this._rotateX = config.rotate.x;
    this._rotateY = config.rotate.y;

    this._barColor = [
      parseInt(config.color.charAt(1) + config.color.charAt(2), 16) / 255,
      parseInt(config.color.charAt(3) + config.color.charAt(4), 16) / 255,
      parseInt(config.color.charAt(5) + config.color.charAt(6), 16) / 255,
    ];

    this._gridWidth = 20;
    this._initWebGL(config.element);
  }
  _initWebGL(element) {
    if (!(element instanceof HTMLCanvasElement)) {
      element = document.getElementById(element);
    }

    this._element = element;
    const gl = (this._gl = this._element.getContext("webgl"));
    this._resize({
      height: this._element.offsetHeight,
      width: this._element.offsetWidth,
    });

    gl.viewport(0, 0, this._element.clientWidth, this._element.clientHeight);

    const vertexShaderScript = `
    attribute vec4 a_position;
    
    uniform mat4 u_matrix;
    void main() {
      gl_Position = u_matrix * a_position;
      
    }
  `;
    const fragmentShaderScript = `
    precision mediump float;
  
    uniform vec4 u_color;
    
    void main() {
       gl_FragColor = u_color;
    }
  `;

    const vertexShaderObj = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShaderObj = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShaderObj, vertexShaderScript);
    gl.shaderSource(fragmentShaderObj, fragmentShaderScript);

    gl.compileShader(vertexShaderObj);
    gl.compileShader(fragmentShaderObj);

    if (!gl.getShaderParameter(vertexShaderObj, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShaderObj));
    }
    if (!gl.getShaderParameter(fragmentShaderObj, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragmentShaderObj));
    }

    this._glProgram = gl.createProgram();

    gl.attachShader(this._glProgram, vertexShaderObj);
    gl.attachShader(this._glProgram, fragmentShaderObj);

    gl.linkProgram(this._glProgram);

    gl.useProgram(this._glProgram);
  }
  _resize({ width, height }) {
    this._element.height = height;
    this._element.width = width;
  }
  _tick() {
    this._renderScene();
    requestAnimationFrame(this._tick.bind(this));
  }
  _renderScene() {
    const gl = this._gl;
    gl.clearColor(1, 1, 1, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    let matrixIndex = gl.getUniformLocation(this._glProgram, "u_matrix");

    let mart4 = glMatrix.mat4.ortho(
      glMatrix.mat4.create(),
      -this._element.width / 2,
      this._element.width / 2,
      -this._element.height / 2,
      this._element.height / 2,
      -1000,
      10000
    );
    mart4 = glMatrix.mat4.scale(
      glMatrix.mat4.create(),
      mart4,
      glMatrix.vec3.fromValues(2.7, 2.5, 2)
    );
    mart4 = glMatrix.mat4.rotate(
      glMatrix.mat4.create(),
      mart4,
      (this._rotateX * Math.PI) / 180,
      glMatrix.vec3.fromValues(1, 0, 0)
    );
    mart4 = glMatrix.mat4.rotate(
      glMatrix.mat4.create(),
      mart4,
      -(this._rotateX * Math.PI) / 180,
      glMatrix.vec3.fromValues(0, 1, 0)
    );

    gl.uniformMatrix4fv(matrixIndex, false, mart4);

    gl.useProgram(this._glProgram);

    this._renderGrid();
    this._renderBar();
  }
  _renderGrid() {
    const gl = this._gl;
    const vertexArray = computeGrid.call(
      this,
      this._barInfo.xNumber,
      this._barInfo.yNumber,
      this._gridWidth
    );

    for (const lineArray of vertexArray) {
      const uniformColorIndex = gl.getUniformLocation(
        this._glProgram,
        "u_color"
      );

      gl.uniform4f(uniformColorIndex, 0, 0, 0, 0.2);

      const positionBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(lineArray),
        gl.STATIC_DRAW
      );

      const attributePositionIndex = gl.getAttribLocation(
        this._glProgram,
        "a_position"
      );

      gl.enableVertexAttribArray(attributePositionIndex);

      gl.vertexAttribPointer(
        attributePositionIndex,
        3,
        gl.FLOAT,
        false,
        (32 / 8) * 3,
        0
      );

      gl.drawArrays(gl.LINE_STRIP, 0, 3);
    }
  }
  _renderBar() {
    const gl = this._gl;
    for (let index = 0; index < this._barInfo.count; index++) {
      const number = this._barInfo.data[index];
      const { vertexArray, indexArray } = computeBarVertexArray.call(
        this,
        number,
        [10 + 20 * index, 0, 17.5],
        10,
        10,
        this._gridWidth,
        this._barInfo.xNumber,
        this._barInfo.yNumber
      );

      const uniformColorIndex = gl.getUniformLocation(
        this._glProgram,
        "u_color"
      );

      gl.uniform4f(
        uniformColorIndex,
        this._barColor[0],
        this._barColor[1],
        this._barColor[2],
        1
      );

      const positionBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexArray),
        gl.STATIC_DRAW
      );

      const indexBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indexArray),
        gl.STATIC_DRAW
      );

      const attributePositionIndex = gl.getAttribLocation(
        this._glProgram,
        "a_position"
      );

      gl.enableVertexAttribArray(attributePositionIndex);

      gl.vertexAttribPointer(
        attributePositionIndex,
        3,
        gl.FLOAT,
        false,
        (32 / 8) * 3,
        0
      );

      gl.drawElements(
        gl.TRIANGLE_STRIP,
        indexArray.length,
        gl.UNSIGNED_SHORT,
        0
      );
    }
  }
  setData(data) {
    const xNumber = data.length || 1;
    const yNumber =
      (data.reduce((val, pre) => {
        return pre > val ? pre : val;
      }, null) || 0) + 1;

    this._barInfo = { xNumber, yNumber, count: data.length, data: data };
    this._tick();
  }
}

function computeBarVertexArray(
  number,
  centerCoordinate,
  length = 10,
  width = 10,
  perHeight,
  xNumber,
  yNumber
) {
  const vertexArray = [];
  const indexArray = [];
  if (Number.isInteger(number)) {
    const [x, y, z] = centerCoordinate;
    //底
    vertexArray.push(
      x - width / 2 - (xNumber * this._gridWidth) / 2,
      y - (yNumber * this._gridWidth) / 2,
      z - length / 2
    );
    vertexArray.push(
      x + width / 2 - (xNumber * this._gridWidth) / 2,
      y - (yNumber * this._gridWidth) / 2,
      z - length / 2
    );
    vertexArray.push(
      x + width / 2 - (xNumber * this._gridWidth) / 2,
      y - (yNumber * this._gridWidth) / 2,
      z + length / 2
    );
    vertexArray.push(
      x - width / 2 - (xNumber * this._gridWidth) / 2,
      y - (yNumber * this._gridWidth) / 2,
      z + length / 2
    );

    if (number !== 0) {
      //顶
      vertexArray.push(
        x - width / 2 - (xNumber * this._gridWidth) / 2,
        perHeight * number - (yNumber * this._gridWidth) / 2,
        z - length / 2
      );
      vertexArray.push(
        x + width / 2 - (xNumber * this._gridWidth) / 2,
        perHeight * number - (yNumber * this._gridWidth) / 2,
        z - length / 2
      );
      vertexArray.push(
        x + width / 2 - (xNumber * this._gridWidth) / 2,
        perHeight * number - (yNumber * this._gridWidth) / 2,
        z + length / 2
      );
      vertexArray.push(
        x - width / 2 - (xNumber * this._gridWidth) / 2,
        perHeight * number - (yNumber * this._gridWidth) / 2,
        z + length / 2
      );

      //索引
      indexArray.push(0, 1, 3, 1, 2, 3);

      indexArray.push(0, 3, 4, 4, 3, 7);
      indexArray.push(1, 0, 5, 5, 0, 4);
      indexArray.push(7, 3, 2, 7, 2, 6);
      indexArray.push(0, 1, 3, 1, 2, 3);

      indexArray.push(4, 7, 5, 5, 7, 6);
    } else {
      indexArray.push(0, 3, 1, 1, 3, 2);
    }
  }
  return { vertexArray, indexArray };
}

function computeGrid(xNumber, yNumber, width) {
  const vertexArray = [];
  for (let index = 0; index <= yNumber; index++) {
    const temArray = [];
    temArray.push(
      0 - (xNumber * width) / 2,
      index * width - (yNumber * width) / 2,
      width
    );
    temArray.push(
      0 - (xNumber * width) / 2,
      index * width - (yNumber * width) / 2,
      0
    );
    temArray.push(
      xNumber * width - (xNumber * width) / 2,
      index * width - (yNumber * width) / 2,
      0
    );
    vertexArray.push(temArray);
  }
  for (let index = 0; index <= xNumber; index++) {
    const temArray = [];
    temArray.push(
      index * width - (xNumber * width) / 2,
      0 - (yNumber * width) / 2,
      width
    );
    temArray.push(
      index * width - (xNumber * width) / 2,
      0 - (yNumber * width) / 2,
      0
    );
    temArray.push(
      index * width - (xNumber * width) / 2,
      yNumber * width - (yNumber * width) / 2,
      0
    );
    vertexArray.push(temArray);
  }
  return vertexArray;
}
