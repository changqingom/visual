const glMatrix = require("./gl-matrix-min");

const numberArray = [2, 3, null, 4, 0, 5, 1, 4, 6, 3];
const gridWidth = 20;
window.glMatrix = glMatrix;
function webGLStart() {
  webGLInit();
  tick();
}

let glProgram, gl, canvas, barInfo;
computeBarInfo(numberArray);
webGLStart();

function webGLInit() {
  canvas = document.getElementById("canvas-bar");

  gl = canvas.getContext("webgl");

  canvas.height = canvas.clientHeight;
  canvas.width = canvas.clientWidth;
  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

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

  glProgram = gl.createProgram();

  gl.attachShader(glProgram, vertexShaderObj);
  gl.attachShader(glProgram, fragmentShaderObj);

  gl.linkProgram(glProgram);

  gl.useProgram(glProgram);
}
function renderScene() {
  gl.clearColor(1, 1, 1, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  let matrixIndex = gl.getUniformLocation(glProgram, "u_matrix");

  let mart4 = glMatrix.mat4.ortho(
    glMatrix.mat4.create(),
    -canvas.width / 2,
    canvas.width / 2,
    -canvas.height / 2,
    canvas.height / 2,
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
    (15 * Math.PI) / 180,
    glMatrix.vec3.fromValues(1, 0, 0)
  );
  mart4 = glMatrix.mat4.rotate(
    glMatrix.mat4.create(),
    mart4,
    -(30 * Math.PI) / 180,
    glMatrix.vec3.fromValues(0, 1, 0)
  );

  gl.uniformMatrix4fv(matrixIndex, false, mart4);

  gl.useProgram(glProgram);

  renderGrid();
  renderBar();
}

function tick() {
  renderScene();
  // requestAnimationFrame(tick);
}
function renderGrid() {
  const vertexArray = computeGrid(barInfo.xNumber, barInfo.yNumber);

  for (const lineArray of vertexArray) {
    const uniformColorIndex = gl.getUniformLocation(glProgram, "u_color");

    gl.uniform4f(uniformColorIndex, 0, 0, 0, 0.2);

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineArray), gl.STATIC_DRAW);

    const attributePositionIndex = gl.getAttribLocation(
      glProgram,
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
function renderBar() {
  for (let index = 0; index < numberArray.length; index++) {
    const number = numberArray[index];
    const { vertexArray, indexArray } = computeBarVertexArray(number, [
      10 + 20 * index,
      0,
      17.5,
    ]);

    const uniformColorIndex = gl.getUniformLocation(glProgram, "u_color");

    gl.uniform4f(uniformColorIndex, 1, 0, 0, 0.5);

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
      glProgram,
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

    gl.drawElements(gl.TRIANGLE_STRIP, indexArray.length, gl.UNSIGNED_SHORT, 0);
  }
  return;
}

function computeBarVertexArray(
  number,
  centerCoordinate,
  length = 10,
  width = 10,
  perHeight = gridWidth
) {
  const vertexArray = [];
  const indexArray = [];
  const { xNumber, yNumber } = barInfo;
  if (Number.isInteger(number)) {
    const [x, y, z] = centerCoordinate;
    //底
    vertexArray.push(
      x - width / 2 - (xNumber * gridWidth) / 2,
      y - (yNumber * gridWidth) / 2,
      z - length / 2
    );
    vertexArray.push(
      x + width / 2 - (xNumber * gridWidth) / 2,
      y - (yNumber * gridWidth) / 2,
      z - length / 2
    );
    vertexArray.push(
      x + width / 2 - (xNumber * gridWidth) / 2,
      y - (yNumber * gridWidth) / 2,
      z + length / 2
    );
    vertexArray.push(
      x - width / 2 - (xNumber * gridWidth) / 2,
      y - (yNumber * gridWidth) / 2,
      z + length / 2
    );

    if (number !== 0) {
      //顶
      vertexArray.push(
        x - width / 2 - (xNumber * gridWidth) / 2,
        perHeight * number - (yNumber * gridWidth) / 2,
        z - length / 2
      );
      vertexArray.push(
        x + width / 2 - (xNumber * gridWidth) / 2,
        perHeight * number - (yNumber * gridWidth) / 2,
        z - length / 2
      );
      vertexArray.push(
        x + width / 2 - (xNumber * gridWidth) / 2,
        perHeight * number - (yNumber * gridWidth) / 2,
        z + length / 2
      );
      vertexArray.push(
        x - width / 2 - (xNumber * gridWidth) / 2,
        perHeight * number - (yNumber * gridWidth) / 2,
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

function computeGrid(xNumber, yNumber, width = gridWidth) {
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

function computeBarInfo(array) {
  const xNumber = array.length || 1;
  const yNumber =
    (array.reduce((val, pre) => {
      return pre > val ? pre : val;
    }, null) || 0) + 1;

  barInfo = { xNumber, yNumber };
}
