
const canvas = document.querySelector('canvas');//seleciona a tag canvas no html para adiconar as edições por meio do javascript
const c = canvas.getContext('2d');//tipo do canvas

document.querySelector('#userInterface').style.display = 'none'//linha para os campos de batalha não aparecer no mapa

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src='./img/pallet town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
  constructor({position, velocity, image}) {
    this.position = position
    this.image = image
  }

  draw() {
    c.drawImage(this.image, -570, -780)
  }
}

const background = new Sprite({
  position: {
    x: -570,
    y: -780
  },
  image: image
})

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  )
}

animate()

window.addEventListener('keydown', (e) =>{
  switch (e.key){
    case'w':
     console.log("apertou w")
     break
    case'a':
     console.log("apertou a")
     break
    case's':
     console.log("apertou s")
     break
    case'd':
     console.log("apertou d")
     break
  }
})