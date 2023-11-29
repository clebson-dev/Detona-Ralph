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
    timerId: setInterval(randomSquare, 800),
    countDownTimerId: setInterval(countDown, 1000),
    buttonReiniciar: document.querySelector("#reiniciar"),
  },
}

const cursor = document.getElementById('cursor');
const cursorWidth = cursor.offsetWidth;
const cursorHeight = cursor.offsetHeight;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX - cursorWidth / 2}px`;
  cursor.style.top = `${e.clientY - cursorHeight / 2}px`;
})

modalExplicativo()

function PersonagemAleatorio() {
  const chance = Math.random();
  if (chance < 0.30 && chance > 0.03) {
    return "girl";
  }
  
  else if (chance <= 0.03 && state.values.live < 4) {
    return "heart"
  }
  
  else {
    return "enemy"
  } 
}

function countDown() {
  state.values.curretTime--
  state.view.timeLeft.textContent = state.values.curretTime

  if (state.values.curretTime <= 0) {
    gameEnd()
  }
}

function velocidadeGame() {
  if (state.values.curretTime <= 10) {
    clearInterval(state.actions.timerId)
    state.actions.timerId = setInterval(randomSquare, 500)
  }
  else if (state.values.curretTime <= 20) {
    clearInterval(state.actions.timerId)
    state.actions.timerId = setInterval(randomSquare, 550)
  }  
  else if (state.values.curretTime <= 30) {
    clearInterval(state.actions.timerId)
    state.actions.timerId = setInterval(randomSquare, 600)
  }
  else if (state.values.curretTime <= 40) {
    clearInterval(state.actions.timerId)
    state.actions.timerId = setInterval(randomSquare, 650)
  }
  else if (state.values.curretTime <= 50) {
    clearInterval(state.actions.timerId)
    state.actions.timerId = setInterval(randomSquare, 700)
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.mp3`)
  audio.volume = 0.2
  audio.play()
}

function randomSquare() {
  velocidadeGame()
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
      }

      else if (square.id === state.values.hitPosition && square.classList.contains("heart")) {

        state.values.live++
        state.view.lives.textContent = state.values.live

        playSound("heart")
        square.classList.remove("heart")
        square.classList.add("hit")
      }

      else {
        state.values.live--
        state.view.lives.textContent = state.values.live
        playSound('error')
        square.classList.add("error")
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

  state.actions.timerId = setInterval(randomSquare, 800)
  state.actions.countDownTimerId = setInterval(countDown, 1000)
  state.view.lock.classList.remove("lock")
}

function createButtonReiniciar() {
  let menu = document.querySelector(".menu")

  let buttonReiniciar = document.createElement("button")
  buttonReiniciar.textContent = "Reiniciar Jogo"
  buttonReiniciar.id = "reiniciar"
  buttonReiniciar.addEventListener("mousedown",()=> {
    gameEnd()
  })

  menu.appendChild(buttonReiniciar)
}

function modalExplicativo() {
  clearInterval(state.actions.countDownTimerId)
  clearInterval(state.actions.timerId)
  removeClass()



  let modalExplicativo = document.createElement('div')
  modalExplicativo.classList.add('modalExplicativo')

  let mensagemExplicativo1 = document.createElement('p')
  mensagemExplicativo1.textContent = 'Atinja Ralph e marque 1 ponto.'
  
  let mensagemExplicativo2 = document.createElement('p')
  mensagemExplicativo2.textContent = 'Atinja a garota e perderá 1 ponto.'
  
  let mensagemExplicativo3 = document.createElement('p')
  mensagemExplicativo3.textContent = 'Se errar o Ralph perderá 1 vida.'

  let mensagemExplicativo4 = document.createElement('p')
  mensagemExplicativo4.textContent = 'colete corações e ganhará 1 vida se ela for inferior a 4.'

  let buttonInitialize = document.createElement('button')
  buttonInitialize.textContent = "iniciar Jogo"
  buttonInitialize.addEventListener("mousedown", () => {
    modalExplicativo.remove()
    createButtonReiniciar()
    initialize()
    reiniciarGame()
  })

  modalExplicativo.appendChild(mensagemExplicativo1)
  modalExplicativo.appendChild(mensagemExplicativo2)
  modalExplicativo.appendChild(mensagemExplicativo3)
  modalExplicativo.appendChild(mensagemExplicativo4)
  modalExplicativo.appendChild(buttonInitialize)

  document.body.appendChild(modalExplicativo)

}

function initialize() {
  addListenerHitBox()
}
