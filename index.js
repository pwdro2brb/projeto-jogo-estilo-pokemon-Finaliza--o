
const canvas = document.querySelector('canvas');//seleciona a tag canvas no html para adiconar as edições por meio do javascript
const c = canvas.getContext('2d');//tipo do canvas


//document.querySelector('#userInterface').style.display = 'none'//linha para os campos de batalha não aparecer no mapa

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70){
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70){
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -500,
  y: -810
}

collisionsMap.forEach((row, i) => {
  row.forEach((Symbol, j) => {
    if (Symbol === 1044) {
      boundaries.push(
       new Boundary({
         position: {
           x: j * Boundary.width + offset.x,
           y: i * Boundary.height + offset.y
         }
       })
      )
    }
  })
});

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((Symbol, j) => {
    if (Symbol > 0) {
      battleZones.push(
       new Boundary({
         position: {
           x: j * Boundary.width + offset.x,
           y: i * Boundary.height + offset.y
         }
       })
      )
    }
  })
});

const image = new Image();
image.src='./img/pallet town.png';

const foregroundImage = new Image();
foregroundImage.src='./img/foregroundObjects.png';

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png';//Imagem do personagem andando de frente

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png';//Imagem do personagem andando de trás

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png';//Imagem do personagem andando para esquerda

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png';//Imagem do personagem andando para direita

up = playerUpImage
left = playerLeftImage
down = playerDownImage
right = playerRightImage

const player = new sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 /2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames:{
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  }
});

const background = new sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed:false
  },
  a: {
    pressed:false
  },
  s: {
    pressed:false
  },
  d: {
    pressed:false
  }
}



const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision ({ rectangle1, rectangle2 }) {
  return(
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height && 
    rectangle1.position.y + rectangle1.height>= rectangle2.position.y
  )
}

const battle = {
  initiated: false
}

function animate() {
  const animationId = window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battleZones.forEach((battleZones) => {
    battleZones.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.animate = false

  console.log(animationId)
  if (battle.initiated) return
  // Ativa a batalha

  if (keys.w.pressed|| keys.a.pressed|| keys.s.pressed|| keys.d.pressed){
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea = 
       (Math.min(
        player.position.x + player.width, 
        battleZone.position.x + battleZone.width
        ) - 
          Math.max(player.position.x, battleZone.position.x)) *
           (Math.min(player.position.y + player.height,
           battleZone.position.y + battleZone.height
          ) - 
        Math.max(player.position.y, battleZone.position.y))
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: battleZone
      }) &&
      overlappingArea >  (player.width * player.height) / 2
      && Math.random() < 0.02
      ) {
        console.log("Ativou a batalha")

        //Desativa o atual loop de animação
        window.cancelAnimationFrame(animationId)

        battle.initiated = true
        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {       
                //Ativa um novo loop de animação
                initBattle()
                animateBattle()
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                  duration: 0.4
                })
              }
            })
          }
        })
        break
      }
    }
  }


  if (keys.w.pressed && lastKey === 'w') {
  player.animate = true
  player.image = up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
          x: boundary.position.x,
          y: boundary.position.y + 3
        }}
      })) {
        moving = false
        break
      }
    }
    if (moving)
    movables.forEach((movable) => {
      movable.position.y += 3
    })  
  } else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
          x: boundary.position.x,
          y: boundary.position.y
        }}
      })) {
        moving = false
        break
      }
    }
    if (moving)
    movables.forEach((movable) => {
      movable.position.x += 3
    }) 
  }
  else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
          x: boundary.position.x,
          y: boundary.position.y - 3
        }}
      })) {
        moving = false
        break
      }
    }
    if (moving)
    movables.forEach((movable) => {
      movable.position.y -= 3
    }) 
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
          x: boundary.position.x - 3,
          y: boundary.position.y
        }}
      })) {
        moving = false
        break
      }
    }
    if (moving)
    movables.forEach((movable) => {
      movable.position.x -= 3
    })  
  }  
}

//animate()



let lastKey = ''
window.addEventListener('keydown', (e) =>{
  switch (e.key){
    case'w':
     keys.w.pressed = true
     lastKey = 'w'
     break
    case'a':
     keys.a.pressed = true
     lastKey = 'a'
     break
    case's':
    keys.s.pressed = true
    lastKey = 's'
     break
    case'd':
     keys.d.pressed = true
     lastKey = 'd'
     break
  }
})

window.addEventListener('keyup', (e) =>{
  switch (e.key){
    case'w':
     keys.w.pressed = false
     break
    case'a':
     keys.a.pressed = false
     break
    case's':
    keys.s.pressed = false
     break
    case'd':
     keys.d.pressed = false
     break
  }
})