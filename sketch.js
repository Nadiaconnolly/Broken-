const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight
let started = false
let numPendulums = 4
let pendulums 
let reverb, filter
 

function setup(){
  createCanvas (canvasWidth, canvasHeight)
  //reverb = new p5.Reverb()
    //filter = new p5.LowPass();
    //reverb.drywet(0.9)
    pendulums  = Array.from({ length: numPendulums}, (el, i) => createPendulum(i))

}

pendulums.forEach((pendulum, i) => {
  pendulum.synth = createSynth(i)
  updatePendulumAngle(pendulum)
  updatePendulumPosition(pendulum)
  drawPendulum(pendulum)
})


function draw(){
  background(106, 146, 247)
  if(started){
        
    pendulums.forEach(pendulum => {
        if(!pendulum.ended){
            updatePendulumAngle(pendulum)
            updatePendulumPosition(pendulum)
            updateSynth(pendulum.angle, pendulum.synth)
            drawPendulum(pendulum)
        }else{
            pendulum.synth.osc.amp(0)
            pendulum.synth.mod.amp(0)
        }

    })
} else {
    drawText()
}
pendulums.forEach(pendulum => {
    // updatePendulumAngle(pendulum)
    // updatePendulumPosition(pendulum)
    drawPendulum(pendulum)
})
}

function mousePressed(){
  if(!started){
      started = true
  }

  pendulums.forEach(pendulum => {
      pendulum.synth.osc.start()
      pendulum.synth.osc.disconnect()
      pendulum.synth.mod.start()
      pendulum.synth.mod.disconnect()
      reverb.process(pendulum.synth.osc, 1.5, 60)
     
  })

}

const drawText = () => {
  textSize(30)
  fill(255)
  noStroke()
  text('welcome to constant wailing', 100, canvasHeight - 100)
}


const drawLine = (pendulum) => {
  stroke(255)
  line(pendulum.center.x, pendulum.center.y, pendulum.lineStart.x, pendulum.lineStart.y)
}


const drawCircle = (pendulum) => {
     fill(pendulum.color)
    ellipse(pendulum.center.x, pendulum.center.y, pendulum.size)
}

const drawPendulum = (pendulum) => {
  if(!pendulum.ended){
    drawLine(pendulum)
    drawCircle(pendulum)
}

}

const updatePendulumAngle = (pendulum) => {
    pendulum.acceleration = (-1 * pendulum.gravity/pendulum.size) * sin(pendulum.angle)
    pendulum.velocity += pendulum.acceleration
    pendulum.damping -= 0.00001
    pendulum.velocity *= pendulum.damping
    //pendulum.velocity *= pendulum.damping rave!
    pendulum.prevAngle = pendulum.angle
    pendulum.angle += pendulum.velocity

}

const updatePendulumPosition = (pendulum) => {
  //pendulum.angle+=0.01
  pendulum.center.x = pendulum.swingRadius * sin(pendulum.angle) + pendulum.origin.x
  pendulum.center.y = pendulum.swingRadius * cos(pendulum.angle) + pendulum.origin.y
}

const createSynth = (i) => {
  const osc = new p5.Oscillator('sine')
  const mod = new p5.Oscillator('sine')
  const modBaseFreq = random(100, 200)
  const modAmp = random(150,350)
  return {
      id: i,
      osc,
      mod,
      modBaseFreq,
      modAmp,
  }
}

const updateSynth = (angle, synth) => {
  const newFreq = Math.abs(sin(angle) * synth.modBaseFreq)
  if(random(0.0,1.0) > 0.2){
      synth.mod.amp(random(-synth.modAmp, synth.modAmp), 0.01)
  }
   synth.mod.freq(newFreq)
  // synth.mod.amp(synth.amp, 0.01)    
  synth.osc.freq(synth.mod)
  // console.log(angle)

  let amplt = map(Math.abs(angle), PI/2, 0, 0, 1.0)
  if(amplt > 0.8 ){
      synth.osc.amp(amplt , 0.001)
  }else{
      synth.osc.amp(0,0.001)
  }
 
  
  synth.mod.amp(0)
}

const createPendulum = () => {
      return {
        origin: {x: canvasWidth/2, y: 500},
        center: {x: canvasWidth/2, y: 500},
        lineStart: {x: canvasWidth/2, y: 300},
        size: 100,
        swingRadius: 200,
        color: [176, 255, 161],
        angle: PI/2,
        gravity: 0.9,
        damping: 0.9995,
        acceleration: 0,
        velocity: 0,
      }
  }


// const createPendulum = (idx) => {
//   const randomY = random(50, 100)
//   return {
//       // geometries
//       id: idx,
//       origin: {x: canvasWidth/2, y: (idx + 1)  * randomY},
//       center: {x: canvasWidth/2, y: 200},
//       lineStart: {x: canvasWidth/2, y: (idx + 1)  * randomY},
//       size: (idx + 1)  * 100,
//       swingRadius: (idx + 1) * 150,
//       color: [(idx + 1)  * 50, 0, (idx + 1)  * 50, 60],
//       // physics
//       gravity: 0.9,
//       damping: 0.99995,
//       angle: Math.PI/(idx + 1) ,
//       acceleration: 0,
//       velocity: 0,
//       // synth
//       synth: null,
//       ended: false,
//   }
// }





// const canvasWidth = window.innerWidth
// const canvasHeight = window.innerHeight
// const waveHeight = 200
// let pendulum

 

// function setup(){
//   createCanvas (canvasWidth, canvasHeight)
//   pendulum = createPendulum()

// }

// function draw(){
//   background(106, 146, 247)
//   updatePendulumAngle(pendulum)
//   updatePendulumPosition(pendulum)
//   drawPendulum(pendulum)
// }


// const drawLine = (pendulum) => {
//   stroke(255)
//   line(pendulum.center.x, pendulum.center.y, pendulum.lineStart.x, pendulum.lineStart.y)
// }


// const drawCircle = (pendulum) => {
//     fill(pendulum.color)
//     ellipse(pendulum.center.x, pendulum.center.y, pendulum.size)
// }

// const drawPendulum = (pendulum) => {
//   drawLine(pendulum)
//   drawCircle(pendulum)
  
// }

// const updatePendulumAngle = (pendulum) => {
//     pendulum.acceleration = (-1 * pendulum.gravity/pendulum.size) * sin(pendulum.angle)
//     pendulum.velocity += pendulum.acceleration
//     pendulum.damping -= 0.00001
//     pendulum.velocity *= pendulum.damping
//     //pendulum.velocity *= pendulum.damping rave!
//     pendulum.angle += pendulum.velocity
// }

// const updatePendulumPosition = (pendulum) => {
//   //pendulum.angle+=0.01
//   pendulum.center.x = sin(pendulum.angle) * pendulum.swingRadius + pendulum.lineStart.x
//   pendulum.center.y = cos(pendulum.angle) * pendulum.swingRadius + pendulum.lineStart.y
// }

// const createPendulum = () => {
//     return {
//       origin: {x: canvasWidth/2, y: 500},
//       center: {x: canvasWidth/2, y: 500},
//       lineStart: {x: canvasWidth/2, y: 300},
//       size: 100,
//       swingRadius: 200,
//       color: [176, 255, 161],
//       angle: PI/2,
//       gravity: 0.9,
//       damping: 0.9995,
//       acceleration: 0,
//       velocity: 0,
//     }
// }
