let astronaut;
let astronautImg;
let words = [];
let score = 0;
let stars = [];

function preload() {
  astronautImg = loadImage('./assets/wings.png');
}

function setup() {
  createCanvas(800, 600);
  astronaut = new Astronaut();
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
  setInterval(addWord, 1000);
}

function draw() {
  background(0);
  astronaut.update();
  astronaut.display();

  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].display();
  }

  for (let i = words.length - 1; i >= 0; i--) {
    words[i].update();
    words[i].display();
    if (words[i].hits(astronaut)) {
      score += 10;
      words.splice(i, 1); // Remove word from array when hit
      astronaut.crashAnimation(); // Trigger crash animation
    }
  }

  fill(255);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}

function addWord() {
  let negativeWords = ['Sad', 'Anger', 'Fear', 'Hate', 'Pain'];
  let word = random(negativeWords);
  words.push(new Word(word));
}

class Astronaut {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 50;
    this.speed = 5;
    this.angle = 0;
    this.wings = astronautImg;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.angle = -HALF_PI;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.angle = HALF_PI;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
      this.angle = 0;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
      this.angle = PI;
    }

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    for (let i = 0; i < stars.length; i++) {
      stars[i].updatePosition(this.x, this.y);
    }
  }

  display() {
    // Display astronaut with wings
    // Display the astronaut with rotated wings image
    push(); // Save current drawing style
    translate(this.x, this.y); // Translate to astronaut's position
    rotate(this.angle); // Rotate by the current angle in radians
    imageMode(CENTER); // Set image mode to center for proper positioning
    image(this.wings, 0, 0, this.size * 2, this.size * 2); // Draw wings centered on astronaut
    pop(); // Restore original drawing style
  }

  crashAnimation() {
    // Flashy animation when astronaut crashes into a word
    // Example: Change background color temporarily
    background(255, 0, 0); // Flash red briefly
    setTimeout(() => {
      background(0); // Return to normal background after a short delay
    }, 100);
  }
}

class Word {
  constructor(text) {
    this.text = text;
    this.x = random(width);
    this.y = -50;
    this.speed = 3;
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(255, 0, 0);
    textSize(32);
    text(this.text, this.x, this.y);
  }

  hits(astronaut) {
    let d = dist(this.x, this.y, astronaut.x, astronaut.y);
    return d < astronaut.size / 2 + textWidth(this.text) / 2;
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = this.size * 0.1;
  }

  update() {
    // Make stars twinkle by slightly changing their positions
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);

    // Wrap around screen edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  updatePosition(astronautX, astronautY) {
    // Update star positions relative to astronaut's movement
    this.x += (astronautX - width / 2) * this.speed * 0.05;
    this.y += (astronautY - height / 2) * this.speed * 0.05;

    // Wrap around screen edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}
