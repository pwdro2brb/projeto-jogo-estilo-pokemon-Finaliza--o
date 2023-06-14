
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

image.onload = () => {
  c.drawImage(image,-785, -650);
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
    );
}