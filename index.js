(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  var mat = {
    translation: function (tx, ty) {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        tx, ty, 1, 0,
        0, 0, 0, 1
      ];
    },

    rotation: function (angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
      ];
    },

    scaling: function (sx, sy) {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
      ];
    },

    multiply_4: function (a, b){
      var c = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          c[i*4+j]= 0;
          for (let k = 0; k < 4; k++) {
            c[i*4+j] += a[j+k*4]*b[i+k*4];
          }
        }
      }
      return c;
    },

    multiply: function (a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];

      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];

      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];

      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];

      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];

      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];

      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];

      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },
  };

  var ANGLE = 0;
  var ANGLE2 = 0;
  var scale = 0;
  var membesar = 1;

  var reflexMatrix = new Float32Array([
       1.0, 0.0, 0.0, 0.0,
       0.0, 1.0, 0.0, 0.0,
       0.0, 0.0, 1.0, 0.0,
       0.0, 0.0, 0.0, 1.0
  ]);

  // draw!
  function draw() {
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var LineVertices1 = new Float32Array([
      -0.45, +0.25,  -0.225, +0.25,
      -0.225, -0.3,  -0.275,-0.3,
      -0.275, -0.05,  -0.4, -0.05,
      -0.4, -0.3,  -0.45, -0.3
    ]);

    var LineVertices2 = new Float32Array([
      -0.275, +0.15,  -0.4, +0.15,
      -0.4, +0.05,  -0.275, +0.05
    ]);

    var TriangelVertices = new Float32Array([
      +0.225, -0.3,  +0.275, -0.3,  +0.225, +0.25,
      +0.275, -0.3,  +0.225, +0.25,  +0.275, +0.25,
      +0.225, +0.25,  +0.45, +0.25,  +0.45, +0.15,
      +0.225, +0.25,  +0.225, +0.15,  +0.45, +0.15,
      +0.45, +0.25,  +0.4, +0.25,  +0.4, -0.3,
      +0.45, +0.25,  +0.45, -0.3,  +0.4, -0.3,
      +0.275, -0.05,  +0.4, -0.05,  +0.4, +0.05,
      +0.275, -0.05,  +0.275, +0.05,  +0.4, +0.05
    ]);

    var uMatrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    if (scale >= 1){
      membesar = -1;
    }
    else if (scale < 0) {
      membesar = 1;
      reflexMatrix [5] *= -1;
    }
    scale = scale + (membesar * 0.0091);
    // scale=1;


    var scaleMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      0.0, scale, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    var translationMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    var mat4combine1 = mat.multiply(scaleMatrix, reflexMatrix);
    var mat4combine = mat.multiply(mat4combine1, translationMatrix);
  
    gl.uniformMatrix4fv(uMatrixLocation, false, mat4combine);

    drawA(gl.TRIANGLES, TriangelVertices);
    
    ANGLE += 0.0091;
    var radian = Math.PI * ANGLE;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    rotationMatrix = new Float32Array([
      cosB, +sinB, 0, 0,
      -sinB, cosB, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);

    translationMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.325,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    

    mat4combine1 = mat.multiply(translationMatrix, rotationMatrix);

    translationMatrix = new Float32Array([
      1.0, 0.0, 0.0, -0.325,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
    
    mat4combine = mat.multiply(mat4combine1, translationMatrix);

    // Set the matrix.
    gl.uniformMatrix4fv(uMatrixLocation, false, mat4combine);

    drawA(gl.LINE_LOOP, LineVertices1);
    drawA(gl.LINE_LOOP, LineVertices2);

    requestAnimationFrame(draw);
  }

  // Generic format
  function drawA(type, vertices) {
    var n = initBuffers(vertices);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices) {
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);
