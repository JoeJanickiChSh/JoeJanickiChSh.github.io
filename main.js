const colorContainer = document.getElementById('color-container');
const canvas = document.getElementById('led-canvas');
const canvasContext = canvas.getContext('2d');
const rotateCheck = document.getElementById('rotate-check');
const fadeCheck = document.getElementById('fade-check');
const animName = document.getElementById('led-name');
const particleCheck = document.getElementById('particle-check');

const particlePosSlider = document.getElementById('particle-pos');
const particleSizeSlider = document.getElementById('particle-size');
const particleSpeedSlider = document.getElementById('particle-speed');
const particleSpeedRandSlider = document.getElementById('particle-speedrand');
const particleLifetimeSLider = document.getElementById('particle-lifetime');
const particleLifeRandSlider = document.getElementById('particle-liferand');


let colorPoints = [];

const colorPointHtml = '<input type="range" min=0 max=1000 class="form-range w-25"><input type="color" class="rounded bg-primary border-0 p-1 mx-3 shadow">';


class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.add = (other) => (new Color(this.r + other.r, this.g + other.g, this.b + other.b));
    this.sub = (other) => (new Color(this.r - other.r, this.g - other.g, this.b - other.b));
    this.mul = (other) => (new Color(this.r * other, this.g * other, this.b * other));
    this.div = (other) => (new Color(this.r / other, this.g / other, this.b / other));
    this.toneMap = () => (new Color(Math.sqrt(this.r), Math.sqrt(this.g), Math.sqrt(this.b)));
  }

  static lerp = (start, end, factor) => end.sub(start).mul(factor).add(start);

}

const newColorPoint = () => {
  const colorPoint = document.createElement('p');
  colorPoint.innerHTML = colorPointHtml;
  colorContainer.appendChild(colorPoint);
  colorPoints.push(colorPoint);
};

const deleteColorPoint = () => {
  let colorPoint = colorPoints.pop();
  colorPoint.remove();
};

const parseColor = (inHex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inHex);
  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    return new Color(r / 255.0, g / 255.0, b / 255.0);
  }
  return null;
}

const rangeMap = (oldStart, oldEnd, newStart, newEnd, index) => {
  return newStart + (newEnd - newStart) * (index - oldStart) / (oldEnd - oldStart);
}

const randRange = (lower, upper) => rangeMap(0, 1, lower, upper, Math.random());

let rotateOffset = 0.0;
let fadeOffset = 0.0;


let getColorFromIndex = (colorList, index) => {
  let higherIndex = 1;
  while (colorList[higherIndex].index < index) {
    higherIndex++;
  }
  let lowestIndex = colorList[higherIndex - 1].index;
  let highestIndex = colorList[higherIndex].index;
  let startColor = colorList[higherIndex - 1].color
  let endColor = colorList[higherIndex].color

  let color = Color.lerp(startColor, endColor, rangeMap(lowestIndex, highestIndex, 0, 1, index));
  return color
}

let getSortedColors = () => {
  let colorPointsParsed = [
    {
      index: -0.1, color: new Color(0, 0, 0)
    },
    {
      index: 1.1, color: new Color(0, 0, 0)
    }
  ];
  for (let colorPoint of colorPoints) {
    let children = colorPoint.children;
    colorPointsParsed.push(
      {
        index: parseInt(children[0].value) / 1000.0,
        color: parseColor(children[1].value)
      }
    );
  }
  colorPointsParsed.sort((a, b) => (a.index > b.index) ? 1 : -1);
  return colorPointsParsed;
}

let generateJson = () => {
  let colorPointsParsed = getSortedColors();
  outJson = {
    "colorPoints": [],
    "rotate": rotateCheck.checked,
    "fade": fadeCheck.checked,
    "particles": particleCheck.checked,
    "particlePos": particlePosSlider.value / 1000.,
    "particleLifetime": particleLifetimeSLider.value,
    "particleLifetimeRand": particleLifeRandSlider.value,
    "particleSpeed": particleSpeedSlider.value / 1000. * 2 - 1,
    "particleSpeedRand": particleSpeedRandSlider.value / 1000.,
    "particleSize": particleSizeSlider.value / 1000.
  }
  for (colorPoint of colorPointsParsed) {
    outJson["colorPoints"].push({
      "index": colorPoint.index,
      "color": {
        "r": colorPoint.color.r,
        "g": colorPoint.color.g,
        "b": colorPoint.color.b
      }
    });
  }

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outJson));
  let dlAnchorElem = document.getElementById('downloadAnchorElem');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `${animName.value}.json`);
  dlAnchorElem.click();

}

class Particle {
  constructor(pos, lifetime, speed, size) {
    this.pos = pos;
    this.lifetime = lifetime;
    this.speed = speed;
    this.initial = lifetime;
    this.size = size;
    this.update = () => {
      this.pos += this.speed;
      this.lifetime--;
    }
  }


}

let particles = [];

let particleTimer = 0;
setInterval(() => {

  let newParticles = [];
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(
      particlePosSlider.value / 1000.,
      particleLifetimeSLider.value + randRange(-1, 1) * particleLifeRandSlider.value,
      (particleSpeedSlider.value / 1000. * 2 - 1) + randRange(-1, 1) * (particleSpeedRandSlider.value / 1000.),
      particleSizeSlider.value / 1000.
    ));
  }

  particles.forEach((particle) => {
    particle.update();
    if (particle.lifetime > 0) {
      newParticles.push(particle);
    }
  });

  particles = newParticles;

  particleTimer++;

  let colorPointsParsed = getSortedColors();
  const numLeds = 50;
  const ledRad = 4;
  for (let i = 0; i < numLeds; i++) {
    let index = (i / (numLeds) + rotateOffset) % 1.0;

    let color = getColorFromIndex(colorPointsParsed, index);

    let color2 = getColorFromIndex(colorPointsParsed, (index + 0.5) % 1);

    if (fadeOffset < 0.5) {
      color = Color.lerp(color, color2, (fadeOffset * 2) % 1);
    } else {
      color = Color.lerp(color2, color, ((fadeOffset - 0.5) * 2) % 1);
    }

    particleBrightness = 0;
    particles.forEach((particle) => {
      if (index >= particle.pos - particle.size && index <= particle.pos + particle.size) {
        particleBrightness += (particle.lifetime / particle.initial);
      }
    });

    if (!particleCheck.checked) {
      particleBrightness = 1;
    }

    color = color.mul(particleBrightness);
    canvasContext.beginPath();
    canvasContext.arc(i * ledRad * 2.5 + 8, canvas.height / 2, ledRad, 0, 2 * Math.PI, false);
    canvasContext.strokeStyle = 'black';
    canvasContext.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
    canvasContext.fill();
    canvasContext.stroke();
  }

  rotateOffset = (rotateCheck.checked) ? ((rotateOffset + 0.03) % 1) : (0);
  fadeOffset = (fadeCheck.checked) ? ((fadeOffset + 0.03) % 1) : 0;
}, 100);