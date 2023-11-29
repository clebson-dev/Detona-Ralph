let timeRandom = 500
const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    hit: document.querySelector(".hit"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    lock: document.querySelector("#lock")
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    curretTime: 60,
    live: 3,
  },
  actions: {
    timerId: setInterval(randomSquare, timeRandom),
    countDownTimerId: setInterval(countDown, 1000),
    buttonReiniciar: document.querySelector("#reiniciar"),
  },
}

function intervaloAleatorio() {
  const intervalos = [50, 100, 150, 200,]
  const indice = Math.floor(Math.random() * intervalos.length)
  
  const intervaloSelecionado = intervalos[indice]
  return intervaloSelecionado  
}

function PersonagemAleatorio() {
  const chance = Math.random();
  if (chance < 0.6 && chance > 0.05) {
    return "girl";
  }
  
  else if (chance <= 0.05) {
    return "heart"
  }
  
  else {
    return "enemy"
  } 
}


state.actions.buttonReiniciar.addEventListener("click", gameEnd)

function countDown() {
  state.values.curretTime--
  state.view.timeLeft.textContent = state.values.curretTime

  if (state.values.curretTime <= 0) {
    gameEnd()
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.mp3`)
  audio.volume = 0.2
  audio.play()
}

function randomSquare() {
  removeClass()

  let randomNumber = Math.floor(Math.random() * 9)
  let randomSquare = state.view.squares[randomNumber]
  randomSquare.classList.add(PersonagemAleatorio())
  state.values.hitPosition = randomSquare.id
}

function removeClass() {
  state.view.squares.forEach((square) => {
    square.classList.remove("error")
    square.classList.remove("enemy")
    square.classList.remove("girl")
    square.classList.remove("heart")
    square.classList.remove("hit")
  })
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition && square.classList.contains("enemy")) {
        state.values.result++
        state.view.score.textContent = state.values.result
        state.values.hitPosition = null
        playSound("hit")
        square.classList.remove("enemy")
        square.classList.add("hit")
        timeRandom = intervaloAleatorio()
      }

      else if (square.id === state.values.hitPosition && square.classList.contains("girl")) {
        if (state.values.result > 0) {
          state.values.result--
          state.view.score.textContent = state.values.result
          state.values.hitPosition = null
        }

        playSound("girlScream")
        square.classList.remove("girl")
        square.classList.add("error")
        timeRandom = intervaloAleatorio()
      }

      else if (square.id === state.values.hitPosition && square.classList.contains("heart")) {
        if (state.values.live < 5) {
          state.values.live++
          state.view.lives.textContent = state.values.live
        }

        playSound("heart")
        square.classList.remove("heart")
        square.classList.add("hit")
        timeRandom = intervaloAleatorio()
      }

      else {
        state.values.live--
        state.view.lives.textContent = state.values.live
        playSound('error')
        square.classList.add("error")
        timeRandom = intervaloAleatorio()
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
  state.view.lock.classList.add("lock")
  clearInterval(state.actions.countDownTimerId)
  clearInterval(state.actions.timerId)

  removeClass()

  const modal = document.createElement('div')
  modal.classList.add('modal')

  const message = document.createElement('h2')
  message.textContent = 'Game Over! Seu resultado foi: ' + state.values.result

  const restartButton = document.createElement('button')
  restartButton.textContent = 'Novo Jogo'
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
  state.view.lock.classList.remove("lock")
}

function initialize() {
  addListenerHitBox()
}

initialize()