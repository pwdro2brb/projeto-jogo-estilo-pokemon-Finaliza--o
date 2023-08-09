const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new sprite({
  position:{
    x:0,
    y:0
  },
  image: battleBackgroundImage
})


const draggle = new Monster(monsters.draggle)
const emby = new Monster(monsters.emby)

const renderedSprites = [draggle, emby]

emby.attacks.forEach((attack) =>{
  const button = document.createElement('button')
  button.innerHTML = attack.name
  document.querySelector('#attackBox').append(button)
})

let battleAnimationId

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()

  console.log(battleAnimationId)

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

animateBattle()

const queue = []

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    emby.attack({ 
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites
    })
    if (draggle.health <= 0){
      queue.push(() =>{
        draggle.faint()
      })
      queue.push(() =>{
        // Deixa tudo preto
        gsap.to('#overlappingDiv', {
          opacity: 1,
          onComplete: () =>{
            cancelAnimationFrame(battleAnimationId)
            animate()
            gsap.to('#overlappingDiv', {
              opacity: 0
            })
          }
        }) 
      })
    }
    

    // ataque dos inimigos
    const randomAttack = 
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

    queue.push(() =>{
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites
      })
      if (emby.health <= 0){
        queue.push(() =>{
          emby.faint()
        })
        queue.push(() =>{
          // Deixa tudo preto
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () =>{
              cancelAnimationFrame(battleAnimationId)
              animate()
              gsap.to('#overlappingDiv', {
                opacity: 0
              })
            }
          }) 
        })
      }
    })
  })

  button.addEventListener('mouseenter', (e) =>{
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    document.querySelector('#attackType').innerHTML = selectedAttack.type
    document.querySelector('#attackType').style.color = selectedAttack.color
  })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0){
    queue[0]()
    queue.shift()
  }else e.currentTarget.style.display = 'none'
})

