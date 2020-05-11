//***WATER GLASS TIMER GLOBALS */
let particles = [];
var waterLevel = 0;

//***MATCH GAME GLOBALS */
const DOWN = 'down';
const UP = 'up';
let startingX = 160;
let startingY = 160;
let cards = [];
const gameState = {
    totalPairs: 8,
    flippedCards: [],
    numMatched: 0,
    attempts: 0,
    waiting: false
};
let cardfaceArray = [];
let cardback;
function preload() {
    cardback = loadImage('images/card_bkg.png');
    cardfaceArray = [
        loadImage('images/food_1.png'),
        loadImage('images/food_2.png'),
        loadImage('images/food_3.png'),
        loadImage('images/food_4.png'),
        loadImage('images/food_5.png'),
        loadImage('images/food_6.png'),
        loadImage('images/food_7.png'),
        loadImage('images/food_8.png')
    ]
}

function setup() {
    createCanvas(1000, 800);
    alert("Welcome to the The Memory Match Game! \n\nMatch all my favorite foods before the water glass fills up!\n\nWhen you click 'OK' timer on the game will begin. ")
    //setting how many cards are in the stack
    let selectedFaces = [];
    for (let z = 0; z < 8; z++) {
        const randomIdx = floor(random(cardfaceArray.length));
        const face = cardfaceArray[randomIdx];
        selectedFaces.push(face);
        selectedFaces.push(face);
        cardfaceArray.splice(randomIdx, 1);
    }
    //creating cards
    selectedFaces = shuffleArray(selectedFaces);
    noStroke();
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            const faceImage = selectedFaces.pop();
            cards.push(new Card(startingX, startingY, faceImage));
            startingX += 160;
        }
        startingY += 160;
        startingX = 160;
    }
}

function draw () {
    //**** MATCH GAME DRAW  */
    clear();
    background('#ffdbea');
    if (gameState.numMatched === gameState.totalPairs) {
        fill('black');
        textSize(66);
        alert('WINNER!!!!');
        noLoop();
    }
    for (let k = 0; k < cards.length; k++) {
        if (!cards[k].isMatch) {
            cards[k].face = DOWN;
        }
        cards[k].show();
    }
    noLoop();
    gameState.flippedCards.length = 0;
    gameState.waiting = false;
    fill('#ef0000');
    textSize(22);
    text('Tries: ' + gameState.attempts, 335, 20);
    text('Matches: ' + gameState.numMatched, 300, 40);

    //new water particles in a loop 
    for(t = 0; t < 1000; t++) {
        setTimeout(() => { 
        let p = new Particle();
        particles.push(p);
        for (let j = 0; j < particles.length; j++) {
            particles[j].update();
            particles[j].show();
            //water particles deleted when they become transparent
            if (particles[j].finished()){
                particles.splice(j, 1);
            }
        }
    }, t * 3);
    }

    //water lever rising as timer in repeating loop
    for (let w = 0; w < 301; w++){
        setTimeout(() => {
            fill('#cddfff');
            rect(750, 400, 120, -w);
            if (w >= 300) {
                //alerting loss when water glass fills up and allowing page refresh when OK is clicked
                alert("You Lose! \n Click OK try again!")
                window.location.reload();
            }
    }, w * 200);
    stroke(1);
    noFill();
    rect(750, 400, 120, -300);
    }
}

//****** TIMER WATER GLASS PARTICLE CONSTRUCTOR *****/
class Particle {
    constructor() {
        this.a = 800;
        this.b = 0;
        this.va = random(-.5, .5);
        this.vb = random(0, 8);
        this.alpha = 255;
    }
    finished() {
        return this.alpha < 0;
    }
    update(){
        this.a += this.va;
        this.b += this.vb
        this.alpha -= 5;
    }
    show() {
        noStroke();
        fill(30, 144, 255, this.alpha);
        ellipse(this.a, this.b, 10);
    }
}

function mousePressed () {
    if (gameState.waiting) {
        return;
    }
    //checking how many cards are flipped befoew allowing 2nd flip
    for (let k = 0; k < cards.length; k++) {
        if (gameState.flippedCards.length < 2 && cards[k].didHit(mouseX, mouseY)) {
            console.log('flipped', cards[k]);
            gameState.flippedCards.push(cards[k]);
        }
    }
    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
            // if cords match then adding to score count
            gameState.flippedCards[0].isMatch = true;
            gameState.flippedCards[1].isMatch = true;
            gameState.flippedCards.length = 0;
            gameState.numMatched++;
            loop();
        } else {
            gameState.waiting = true;
            const loopTimeout = window.setTimeout(() => {
                loop();
                window.clearTimeout(loopTimeout);
            }, 1000)
        }
    }
}
//******** MATCH GAME CARD CONSTRUCTOR *******/
class Card {
    constructor (x, y, cardFaceImg) {
        this.x = x;
        this.y = y;
        this.r = 90; 
        this.height = 100;
        this.face = DOWN;
        this.cardFaceImg = cardFaceImg;
        this.isMatch = false;
        this.show();
    }

    show () {
        if (this.face === UP || this.isMatch) {
            noStroke();
            ellipse(this.x, this.y, this.r+40);
            image(this.cardFaceImg, this.x - 70, this.y - 70);
        } else {
            fill('pink');
            ellipse(this.x, this.y, this.r+40);
            image(cardback, this.x - 35, this.y - 25);

        }
    }

    didHit (mouseX, mouseY) {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d <= this.r) {
            this.flip();
            return true;
        } else {
            return false;
        }
    }

    flip () {
        if (this.face === DOWN) {
            this.face = UP;
        } else {
            this.face = DOWN;
        }
        this.show();
    }
}

function shuffleArray (array) {
    let counter = array.length;
    while (counter > 0) {
        // Randomizng card shuffle
        const idx = Math.floor(Math.random() * counter);
        // lowering couter by 1
        counter--;
        // change with last
        const temp = array[counter];
        array[counter] = array[idx];
        array[idx] = temp;
    }
    return array;
}