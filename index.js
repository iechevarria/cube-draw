// from https://codepen.io/AshKyd/pen/JKGVmY

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

function shadeColor (color, percent) {
  color = color.substr(1)
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
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

drawCube(200, 200, 40, 40, 40, '#bbbbbb')
drawCube(240, 220, 40, 40, 40, '#bbbbbb')
drawCube(40, 80, 40, 40, 40, '#cccccc')

