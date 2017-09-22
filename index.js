// from https://codepen.io/AshKyd/pen/JKGVmY

var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

var mouseLoc = [-1, -1]
var cursorMode = 'draw'
var renderMode = 'draw'
var elevation = 0
var renderAbove = true

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

function shadeColor (color, percent) {
  color = color.substr(1)
  var num = parseInt(color, 16)
  var amt = Math.round(2.55 * percent)
  var R = (num >> 16) + amt
  var G = (num >> 8 & 0x00FF) + amt
  var B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

function drawCube (x, y, wx, wy, h, color) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - wx, y - wx * 0.5)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x, y - h * 1)
  context.closePath()
  context.fillStyle = shadeColor(color, -10)
  context.strokeStyle = color
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + wy, y - wy * 0.5)
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.lineTo(x, y - h * 1)
  context.closePath()
  context.fillStyle = shadeColor(color, 10)
  context.strokeStyle = shadeColor(color, 50)
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y - h)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.closePath()
  context.fillStyle = shadeColor(color, 20)
  context.strokeStyle = shadeColor(color, 60)
  context.stroke()
  context.fill()
}

function drawOutline (x, y, wx, wy, h, color, fill) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - wx, y - wx * 0.5)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.lineTo(x + wy, y - wy * 0.5)
  context.closePath()

  context.fillStyle = fill
  context.fill()

  context.moveTo(x - wx, y - wx * 0.5)
  context.lineTo(x + wy, y - h - wy * 0.5)

  context.moveTo(x, y)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))

  context.moveTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x + wy, y - wy * 0.5)

  context.strokeStyle = color
  context.stroke()
}

function drawShadow (x, y, fill) {
  context.moveTo(x, y)
  context.lineTo(x - 20, y - 10)
  context.lineTo(x, y - 20)
  context.lineTo(x + 20, y - 10)
  context.closePath()

  context.fillStyle = fill
  context.fill()
}

function drawGrid (y) {
  context.beginPath()
  context.moveTo(0, 800)
  context.lineTo(800, 800)
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.75 - 20 * y)
  context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.5 - 20 * y)
  context.lineTo(0, CANVAS_HEIGHT * 0.75 - 20 * y)
  context.closePath()

  context.fillStyle = 'rgba(0, 0, 0, 0.4)'
  context.fill()

  context.beginPath()

  for (var i = 0; i < 21; i++) {
    context.moveTo(CANVAS_WIDTH / 2 - 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(CANVAS_WIDTH - 20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))

    context.moveTo(CANVAS_WIDTH / 2 + 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))
  }

  context.strokeStyle = '#ccc'
  context.stroke()
}

var board = {
  arrContents: new Array(20),

  fill: function (i, j, k) {
    this.arrContents[i][j][k] = 1
  },

  erase: function (i, j, k) {
    this.arrContents[i][j][k] = 0
  },

  reset: function () {
    for (var i = 0; i < 20; i++) {
      this.arrContents[i] = new Array(20)
      for (var j = 0; j < 20; j++) {
        this.arrContents[i][j] = new Array(20)
        for (var k = 0; k < 20; k++) {
          this.arrContents[i][j][k] = 0
        }
      }
    }
  }
}

function drawCursor () {
  if (cursorMode === 'draw') {
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1 - 2 * elevation) * 10, 20, 20, 20, '#0f0', 'rgba(68, 170, 68, 0.5)')
    drawShadow((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10)
  } else {
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1 - 2 * elevation) * 10, 20, 20, 20, '#f00', 'rgba(170, 68, 68, 0.5)')
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#fff'
  context.font = '14px Courier'
  context.fillText('x: ' + mouseLoc[0].toString(), 25, 30)
  context.fillText('y: ' + mouseLoc[1].toString(), 25, 50)

  if (renderMode === 'draw') {
    drawGrid(0)
    for (var y = 0; y <= 20; y++) {
      if (y === elevation) {
        drawGrid(elevation)
      }
      for (var i = 0; i < 20; i++) {
        for (var j = 19; j >= 0; j--) {
          if (board.arrContents[i][j][y] === 1 && y <= elevation) {
            drawCube((i + j + 1) * 20, 600 + (i - j + 1) * 10 - 20 * y, 20, 20, 20, '#aaaaaa')
          } else if (board.arrContents[i][j][y] === 1 && y > elevation && renderAbove === true) {
            drawOutline((i + j + 1) * 20, 600 + (i - j + 1 - 2 * y) * 10, 20, 20, 20, '#aaa', 'rgba(170, 170, 170, 0.5)')
          }
          if (y === elevation && i === mouseLoc[0] && j === mouseLoc[1]) {
            drawCursor()
          }
        }
      }
    }
  } else if (renderMode === 'view') {
    for (var y = 0; y < 20; y++) {
      for (var i = 0; i < 20; i++) {
        for (var j = 19; j >= 0; j--) {
          if (board.arrContents[i][j][y] === 1) {
            drawCube((i + j + 1) * 20, 600 + (i - j + 1) * 10 - 20 * y, 20, 20, 20, '#aaaaaa')
          }
        }
      }
    }
  }
}

function setCursor (e) {
  if (Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30 - elevation !== mouseLoc[0] ||
      -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29) + elevation !== mouseLoc[1]) {
    mouseLoc[0] = Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30 + elevation
    mouseLoc[1] = -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29 + elevation)
    draw()
  }
}

function handleClick () {
  if (cursorMode === 'draw') {
    board.fill(mouseLoc[0], mouseLoc[1], elevation)
    draw()
  } else if (cursorMode === 'erase') {
    board.erase(mouseLoc[0], mouseLoc[1], elevation)
    draw()
  }
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // up: move grid up
  if (key === 38) {
    elevation = Math.min(19, elevation + 1)
    draw()
  // down: move grid down
  } else if (key === 40) {
    elevation = Math.max(0, elevation - 1)
    draw()
  // e: erase
  } else if (key === 69) {
    cursorMode = 'erase'
    draw()
  // w: write
  } else if (key === 87) {
    cursorMode = 'draw'
    draw()
  // s: set rendermode to showing
  } else if (key === 83) {
    renderMode = 'view'
    draw()
  // d: set rendermode to drawing
  } else if (key === 68) {
    renderMode = 'draw'
    draw()
  }
}

board.reset()
canvas.addEventListener('mousemove', setCursor)
canvas.addEventListener('mousedown', handleClick)
draw()
