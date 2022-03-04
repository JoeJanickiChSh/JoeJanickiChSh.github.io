const NUM_LEDS = 10


function componentToHex(c) {
  var hex = Math.floor(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colorAdd(c1, c2) {
  return {
    r: c1.r + c2.r,
    g: c1.g + c2.g,
    b: c1.b + c2.b
  };
}
function colorSub(c1, c2) {
  return {
    r: c1.r - c2.r,
    g: c1.g - c2.g,
    b: c1.b - c2.b
  };
}
function colorMul(c, s) {
  return {
    r: c.r * s,
    g: c.g * s,
    b: c.b * s
  };
}
function colorDiv(c, s) {
  return {
    r: c.r / s,
    g: c.g / s,
    b: c.b / s
  };
}

function colorLerp(c1, c2, fac) {

  // (c2-c1)*fac + c1


  return colorAdd(colorMul(colorSub(c2, c1), fac), c1)
}


function rainbow() {
  let colors = [
    "#ff0000",
    "#ff5500",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#5500ff",
    "#ff00ff",
    "#ff00ff",
    "#ff00ff"
  ];
  for (let i = 0; i < NUM_LEDS; i++) {
    let led = document.getElementById(`led${0}${i}`);
    led.value = colors[i];
  }
}

function copyAll() {
  for (let j = 1; j < NUM_LEDS; j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let led = document.getElementById(`led${j}${i}`);
      let top = document.getElementById(`led${0}${i}`);
      led.value = top.value;
    }
  }
}

function shiftLeft() {
  for (let j = 1; j < NUM_LEDS; j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let led = document.getElementById(`led${j}${(i + j) % NUM_LEDS}`);
      let top = document.getElementById(`led${0}${i}`);
      led.value = top.value;
    }
  }
}

function bounce() {
  for (let j = 1; j < Math.floor(NUM_LEDS / 2); j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let led = document.getElementById(`led${j}${(i + j * 2) % NUM_LEDS}`);
      let top = document.getElementById(`led${0}${i}`);
      led.value = top.value;
    }
  }

  for (let j = Math.floor(NUM_LEDS / 2); j < NUM_LEDS; j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let led = document.getElementById(`led${j}${NUM_LEDS - 1 - ((i + j * 2) % NUM_LEDS)}`);
      let top = document.getElementById(`led${0}${i}`);
      led.value = top.value;
    }
  }
}

function fade() {
  for (let j = 1; j < NUM_LEDS - 1; j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let led = document.getElementById(`led${j}${i}`);
      let top = hexToRgb(document.getElementById(`led${0}${i}`).value);
      let bottom = hexToRgb(document.getElementById(`led${NUM_LEDS - 1}${i}`).value);
      led.value = rgbToHex(colorLerp(top, bottom, j / NUM_LEDS));
    }
  }
}

function reverse() {
  for (let j = 0; j < Math.floor(NUM_LEDS / 2); j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let inLed = document.getElementById(`led${j * 2}${i}`).value;
      let outLed = document.getElementById(`led${j}${i}`);
      outLed.value = inLed;
    }
  }
  for (let j = 0; j < Math.floor(NUM_LEDS / 2); j++) {
    for (let i = 0; i < NUM_LEDS; i++) {
      let inLed = document.getElementById(`led${j}${i}`).value;
      let outLed = document.getElementById(`led${NUM_LEDS - 1 - j}${i}`);
      outLed.value = inLed;
    }
  }
  let outLed2 = document.getElementById(`led${NUM_LEDS - 1 - j}${i}`);
}

function blend() {
  let startColor = hexToRgb(document.getElementById('led00').value);
  let endColor = hexToRgb(document.getElementById(`led0${NUM_LEDS - 1}`).value);

  for (let i = 0; i < NUM_LEDS; i++) {
    let led = document.getElementById(`led0${i}`);
    led.value = rgbToHex(colorLerp(startColor, endColor, i / NUM_LEDS));
  }
}

function invert() {
  let leds = [];
  for (let i = 0; i < NUM_LEDS; i++) {
    leds.push(new Array(NUM_LEDS));
  }
  for (let i = 0; i < NUM_LEDS; i++) {
    for (let j = 0; j < NUM_LEDS; j++) {
      leds[j][i] = document.getElementById(`led${j}${i}`).value;
    }
  }

  for (let i = 0; i < NUM_LEDS; i++) {
    for (let j = 0; j < NUM_LEDS; j++) {
      let led = document.getElementById(`led${j}${i}`);
      led.value = leds[NUM_LEDS - 1 - j][i];
    }
  }
}

function generate() {

  let leds = [];
  for (let j = 0; j < NUM_LEDS; j++) {
    let row = [];
    for (let i = 0; i < NUM_LEDS; i++) {
      row.push(hexToRgb(document.getElementById(`led${j}${i}`).value));
    }
    leds.push(row);
  }

  let storageObj = { "leds": leds }

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
  let dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "leds.json");
  dlAnchorElem.click();
}

function init() {
  let leds = document.getElementById('leds');
  for (let i = 0; i < NUM_LEDS; i++) {
    for (let j = 0; j < NUM_LEDS; j++) {
      leds.innerHTML += `<input class="led" type="color" id="led${i}${j}">`;
    }
    leds.innerHTML += '<br>';
  }
}



init();