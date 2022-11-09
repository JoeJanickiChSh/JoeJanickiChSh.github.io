
function randint(minval, maxval) {
  return Math.floor(Math.random() * (maxval - minval)) + minval;
}

const numberButton = (num) => `<button class="btn btn-primary text-light m-3 shadow" onclick="pressFactor(${num})" id="btn${num}">${num}</button>`;


const productNum = document.getElementById('productNum');
const buttonDiv = document.getElementById('buttonDiv');
const timer = document.getElementById('timer');
let timerMs = 0;
let gameRunning = true;
let correctResponses = 0;
let currentLevel = -1;

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const lose = () => {
  productNum.innerHTML = '<h3 class="text-danger"> Game Over</h3>';
  buttonDiv.innerHTML = '<button class="btn btn-primary text-light m-3 shadow" onclick="newRound(0);">Play Again</button>'
  gameRunning = false;
  currentLevel = 0;
};



const pressFactor = (factor) => {
  const btn = document.getElementById(`btn${factor}`);
  if (productNum.innerHTML % factor == 0) {
    correctResponses -= 1;
    btn.innerHTML = `<span class="bg-success rounded py-2 px-2">${factor}</span>`;
    btn.onclick = '';
    return;
  }
  lose();

}


const newRound = (level) => {
  let factors = [];

  let i = 0;

  timerMs = 30000 * Math.pow(1.2, -level);
  gameRunning = true;

  while (i < Math.min(level + 4, 8)) {
    let fac = randint(2, 11);
    if (!factors.includes(fac)) {
      factors.push(fac);
      i++;
    }
  }

  buttonDiv.innerHTML = '';
  factors.forEach(fac => {
    buttonDiv.innerHTML += numberButton(fac);

  });

  prod = 1;
  shuffleArray(factors);
  let newArray = factors.map(x => x);

  for (i = 0; i < 2; i++) {
    prod *= factors.pop();
  }
  correctResponses = 0;
  newArray.forEach(x => {
    if (prod % x == 0) {
      correctResponses++;
    }
  });

  console.log(prod);
  productNum.innerHTML = prod;

}



setInterval(() => {
  if (!gameRunning) {
    return;
  }
  seconds = Math.floor((timerMs / 1000) * 10) / 10;




  timer.innerHTML = (`Level ${currentLevel + 1} - ${seconds}s`)

  timerMs -= 100;

  if (correctResponses <= 0) {
    currentLevel++;
    newRound(currentLevel);
  }

  if (timerMs < 0) {
    timerMs = 0;
    lose();
  }
}, 100);