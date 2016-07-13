var x = 50;
var y = 30;

var dx = 2;

var dAngle = Math.PI/64; 

var turn = 0;

var tanksizeX = 20;
var tanksizeY = 14;

var inc = 0.0025;

var bullets = [];

//array containing all y-values of the terrain
var terrain = [];
//derivative of terrain
var terrainDer = [];

var tanks = [];

function createTerrain(){
    var xoff = 0;
    for(var x = 0; x < width; x++){   
        terrain[x] = height - noise(xoff) * height * .5;
        terrainDer[x] = terrain[x] - terrain[x - 1];
        xoff += inc;
    }
}

function drawTerrain(){
    for(var x = 0; x < width; x++){
        stroke(1, 166, 17);
        line(x, height, x, terrain[x] + 5);
        stroke(0, 104, 10);
        line(x, terrain[x] + 5, x, terrain[x]);
    }
}

//tank constructor
function Tank(x, color, angle){
    this.x = x;
    this.color = color;
    this.angle = angle;
}

function Bullet(x, y, force){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    
    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }
    this.applyForce = function(force) {
        this.acc.add(force);
    }
}

function drawTank(tank){
    var halftankX = .5 * tanksizeX;
    var halftankY = .5 * tanksizeY;
    var angle = Math.atan(terrainDer[tank.x]);
    var halfdia = Math.sqrt(Math.pow(halftankX, 2) + Math.pow(tanksizeY, 2));
    var halfdiaangle = Math.atan(tanksizeY/ halftankX);
    
    //drawing barrel
    beginShape();
    stroke(0);
    fill(tank.color);
    translate(tank.x, terrain[tank.x] - .75 * halftankX);
    rotate(tank.angle);
    rect(-2, 0, 4, -20);
    rotate(-tank.angle);
    translate(-tank.x, -terrain[tank.x] + .75 * halftankX);
    endShape();
    
    //drawing body
    var xA = tank.x - 10 * Math.cos(angle);
    var yA = terrain[tank.x] - 10 * Math.sin(angle);
    var xB = tank.x + 10 * Math.cos(angle);
    var yB = terrain[tank.x] + 10 * Math.sin(angle);
    var xC = tank.x + .75 * halfdia * Math.cos(halfdiaangle - angle);
    var yC = terrain[tank.x] - .75 * halfdia * Math.sin(halfdiaangle - angle);
    var xD = tank.x - .75 * halfdia * Math.cos(halfdiaangle + angle);
    var yD = terrain[tank.x] - .75 * halfdia * Math.sin(halfdiaangle + angle);
    
    beginShape();
    stroke(0);
    fill(tank.color);
    vertex(xA, yA);
    vertex(xB, yB);
    vertex(xC, yC);
    vertex(xD, yD);
    endShape();
}

function drawBullet(bullet){
    ellipse(bullet.x, bullet.y, 2, 2);
}

function setup() {
    createCanvas(600, 400);
    createTerrain();
    tanks = [new Tank(50, "red", 1.25 * Math.PI), new Tank(550, "green", .75 * Math.PI)];
    gravity = createVector(0, -.00000000000000000000000000000000000000000000000000000000000001);
}

function draw() {
    background(255);
    drawTerrain();
    
    activeTank = tanks[turn];
    
    if(keyIsDown(LEFT_ARROW)){
        activeTank.x -= dx;
    }
    if(keyIsDown(RIGHT_ARROW)){
        activeTank.x += dx;
    }
    
    if(keyIsDown(UP_ARROW)){
        activeTank.angle -= dAngle;
    }
    if(keyIsDown(DOWN_ARROW)){
        activeTank.angle += dAngle;
    }
    
    for (var i = tanks.length - 1; i >= 0; i--) {
        drawTank(tanks[i]);
    }
    
    for (var i = bullets.length -1; i >= 0; i--) {
        drawBullet(bullets[i]);
        bullets[i].applyForce(gravity);
        bullets[i].update();
    }
}

function keyPressed() {
    if(keyCode == CONTROL){
        turn  = 1 - turn;
    }
    
    if(keyCode == SHIFT){
        activeTank = tanks[turn];
        bullets.push(new Bullet(activeTank.x, terrain[activeTank.x] - .375 * tanksizeX));
        var velocity = .00001;
        //bullets[bullets.length - 1].applyForce(createVector(velocity * cos(activeTank.angle), velocity * sin(activeTank.angle)));
    }
}