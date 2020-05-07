var x;
var y = 300;
let particles = [];
var waterLevel = 0;


function setup() {
    createCanvas(800, 600);
}
function draw () {
    clear();
    background('pink');

    //new water particles
    let p = new Particle();
    particles.push(p);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].show();
        //water particles deleted when they become transparent
        if (particles[i].finished()){
            particles.splice(i, 1);
        }
    }

    //water lever rising as timer
    noStroke();
    waterLevel -= .15;
    rect(50, 400, 100, waterLevel);
    if (waterLevel === -260) {
        alert("You lose! Refresh to try again!");
        waterLevel = 0;
    }
    
    //water glass outline
    stroke(0, 0, 0);
    strokeWeight(3);
    noFill();
    rect(50, 400, 100, -260);
   
}
    //creating new water particles
class Particle {
    constructor() {
        this.x = 100;
        this.y = 0;
        this.vx = random(-.5, .5);
        this.vy = random(0, 7);
        this.alpha = 255;
    }
    finished() {
        return this.alpha < 0;
    }
    update(){
        this.x += this.vx;
        this.y += this.vy
        this.alpha -= 6;
    }
    show() {
        noStroke();
        fill(30, 144, 255, this.alpha);
        ellipse(this.x, this.y, 10);
    }
}
