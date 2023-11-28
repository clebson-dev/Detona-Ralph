const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    hit: document.querySelector(".hit"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    curretTime: 60,
    live: 3,
  },
  actions: {
    timerId: setInterval(randomSquare, 700),
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function countDown() {
  state.values.curretTime--
  state.view.timeLeft.textContent = state.values.curretTime

  if (state.values.curretTime <= 0) {
    gameEnd()
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`)
  audio.volume = 0.2
  audio.play()
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy")
  })
  state.view.squares.forEach((square) => {
    square.classList.remove("hit")
  })

  let randomNumber = Math.floor(Math.random() * 9)
  let randomSquare = state.view.squares[randomNumber]
  randomSquare.classList.add("enemy")
  state.values.hitPosition = randomSquare.id
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++
        state.view.score.textContent = state.values.result
        state.values.hitPosition = null
        playSound("hit")
        square.classList.remove("enemy")
        square.classList.add("hit")
      }
      else {
        state.values.live--
        state.view.lives.textContent = state.values.live
        verifyLives()
      }
    })
  })
}

function verifyLives() {
  if (state.values.live <= 0) {
    gameEnd()
  }
}

function gameEnd() {
  clearInterval(state.actions.countDownTimerId)
  clearInterval(state.actions.timerId)

  const modal = document.createElement('div')
  modal.classList.add('modal')

  const message = document.createElement('h2')
  message.textContent = 'Game Over! Seu resultado foi: ' + state.values.result

  const restartButton = document.createElement('button')
  restartButton.textContent = 'Reiniciar Jogo'
  restartButton.addEventListener('click', reiniciarGame)

  modal.appendChild(message)
  modal.appendChild(restartButton)

  document.body.appendChild(modal)
}

function reiniciarGame() {
  state.values.curretTime = 60
  state.values.result = 0
  state.values.live = 3

  state.view.timeLeft.textContent = state.values.curretTime;
  state.view.score.textContent = state.values.result
  state.view.lives.textContent = state.values.live

  const modal = document.querySelector('.modal')
  if (modal) {
    modal.remove()
  }

  state.actions.timerId = setInterval(randomSquare, 700)
  state.actions.countDownTimerId = setInterval(countDown, 1000)
}


function initialize() {
  addListenerHitBox()
}

initialize()