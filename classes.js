class sprite {
  constructor({
      position,
      image,
      frames = { max: 1, hold: 10 },
      sprites,
      animate = false,
      rotation = 0,
      button
    }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }

    this.image.onload = () =>{
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation
    this.button = button

  }

  draw() {
    c.save()
    c.translate(
      this.position.x + this.width / 2, 
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2, 
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()
    if (!this.animate) return

    if (this.frames.max > 1){
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
      }      
    }     
}
class Monster extends sprite{
  constructor({ 
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
    button  
  }) {
    super({
      position,
      image,
      frames ,
      sprites,
      animate,
      rotation,
      button
    })
    this.name = name    
    this.health = 100
    this.isEnemy = isEnemy
    this.attacks = attacks
  }
  faint() {
    document.querySelector('#dialogueBox').innerHTML = this.name + ' Caiu!' 
    gsap.to(this.position, {
      y:this.position.y + 20
    })
    gsap.to(this, {
      opacity:0
    })
  }

  attack ({attack, recipient, renderedSprites}) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML = 
    this.name + ' usou ' + attack.name

    let healthbar = '#enemyHealthBar'
    if (this.isEnemy) healthbar = '#playerHealthBar'

    recipient.health -= attack.damage

    const tl = gsap.timeline()
  
    let movementDistance = 20

    let rotation = 1 
    if (this.isEnemy) rotation = -2.2

    switch(attack.name) {
      case 'Bola_de_fogo':
        const fireballImage= new Image()
        fireballImage.src = './img/fireball.png'
        const fireball = new sprite ({
          position:{
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation
        })

        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            //Onde o inimigo realmente leva a porrada
            gsap.to(healthbar, {
              width: recipient.health + '%'
            })
  
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo:true,
              repeat: 5,
              duration: 0.08,
              opacity: 0 
            })
  
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })

      break
      case 'Impulso_Violento':

  
        movementDistance = 100
        if(this.isEnemy) movementDistance = -50
  
           
        tl.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position,{
          x: this.position.x + movementDistance * 2,
          duration: 0.05,
          onComplete: () => {
            //Onde o inimigo realmente leva a porrada
            gsap.to(healthbar, {
              width: recipient.health + '%'
            })
  
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo:true,
              repeat: 5,
              duration: 0.08,
              opacity: 0 
            })
  
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
          }
        }).to(this.position,{
          x: this.position.x 
        })
      break
      case 'Explosão_De_Ions':
        const explosãoDeIonsImage= new Image()
        explosãoDeIonsImage.src = './img/Special attack1.png'
        const explosãoDeIons = new sprite ({
          position:{
            x: recipient.position.x,
            y: recipient.position.y
          },
          image: explosãoDeIonsImage,
          frames: {
            max: 18,
            hold: 3
          },
          animate: true
        })

        renderedSprites.splice(1, 0, explosãoDeIons)

        gsap.to(explosãoDeIons.position, {
          duration: 0.8,
          onComplete: () => {
            //Onde o inimigo realmente leva a porrada
            gsap.to(healthbar, {
              width: recipient.health + '%'
            })
  
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo:true,
              repeat: 5,
              duration: 0.08,
              opacity: 0 
            })
  
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })
        
      break
      case 'Ataque':
        

        if(this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position,{
          x: this.position.x + movementDistance * 2,
          duration: 0.05,
          onComplete: () => {
            //Onde o inimigo realmente leva a porrada
            gsap.to(healthbar, {
              width: recipient.health + '%'
            })
  
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo:true,
              repeat: 5,
              duration: 0.08,
              opacity: 0 
            })
  
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
          }
        }).to(this.position,{
          x: this.position.x 
        })
        break
      }    
    }
}
class Boundary {
  static width = 48 
  static height = 48
  constructor({position}) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}