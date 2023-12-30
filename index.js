// note There is a bug when ghost move the ball alone. The ball wrapping is not taken in consideration. The ball can disapear outside the canvas/viewport. 
// Maybe not that strange / coulb be a "feature" (not a bug)😉, after all, Ghost can move trought wall !!! (or unknow dimention: ex.: out of canvas size)
// Stop pushing 'g' and you could get back the ball with a little bit of effort, maybe?

function rng(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var canvas = document.createElement("canvas");//document.getElementById("canvas");
document.body.append(canvas);
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
canvas.ctx = canvas.getContext("2d");
var fps = 1000/60; // 60 fps
var gameLoopOn = false;

/*
document.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
    // could add stuff here later
}, true);
*/

/*
document.addEventListener("keypress", (e) =>{ // keypress don't work with some key, like shift, ctrl
    switch(e.key){

        default: {
            //console.log(e.key);
        }
    }
}, true);
*/

document.addEventListener("keydown", (e) =>{ 
    switch(e.key){
        case "w": 
        case "ArrowUp": {
           ball.moveUp = true;
            break;
        }
        case "a": 
        case "ArrowLeft": {
            ball.moveLeft = true;
             break;
         }
         case "s": 
         case "ArrowDown": {
            ball.moveDown = true;
             break;
         }
         case "d": 
         case "ArrowRight": {
            ball.moveRight = true;
             break;
         }
         case "Escape": {
            gameLoopOn = !gameLoopOn; // toggle/switch between true and false. How i can forget how to do that for Christ sake.
            if(gameLoop && !gameLoopId){
                gameLoopId = setInterval(gameLoop, fps);
                window.msg.remove();
            }
            else{
                window.msg.show();
            }
            break;
        }
        case "g":{
            // init ghost for a few "seconds"
            if(window.ghostDuration){ break;} // or strange thing happen when more than one ghost try to take control!!!
            ball.speed = ball.speed / 2;
            window.ghostDuration = rng(60,180); // une a trois sec
            window.ghostId = setInterval(mindControled, fps);
            break;
        }
        default: {
            //console.log(e.key, gameLoopId);
        }
    }
}, true);

document.addEventListener("keyup", (e) =>{ 
    switch(e.key){
        case "w": 
        case "ArrowUp": {
            ball.moveUp = false;
             break;
         }
         case "a": 
         case "ArrowLeft": {
             ball.moveLeft = false;
              break;
          }
          case "s": 
          case "ArrowDown": {
             ball.moveDown = false;
              break;
          }
          case "d": 
          case "ArrowRight": {
             ball.moveRight = false;
              break;
          }
        default: {
            //console.log(e.key);
        }
    }
}, true);

class ShowMsg{
    constructor(title){
    this.label = document.createElement("label");
    this.label.setAttribute("for", "speed");
    this.label.setAttribute("id", "speed-label");
    this.label.innerText = "Speed of the ball: ";
    this.numberField = document.createElement("input");
    this.numberField.setAttribute("type", "number");
    this.numberField.setAttribute("id", "speed");
    this.numberField.value = 10;
    this.numberField.addEventListener("change", (e) => {ball.changeSpeed(e);}, false);
    this.wr = document.createElement("div");
    this.wr.setAttribute("id", "wr");
    document.body.append(this.wr);
    this.d = document.createElement("div");
    this.d.innerHTML = "Game Paused";
    this.d.style.paddingTop = "10px";
    this.info = document.createElement("p");
    this.info.innerText = "Press 'ESC' to show that menu/pause the game. \nPress 'WSAD' keys or Arrow key to move the ball. \nPress 'g' to make the ball possesed for a short time! \n The ball warp around the browser edge.";
    this.d.append(this.info, this.label, this.numberField);
    this.d.style.fontSize = "24px";
    document.body.append(this.d);
    this.width = document.body.clientWidth / 2;
    this.height = this.d.getBoundingClientRect().height;
    this.d.style.width = this.width + "px";
    this.d.style.left = (document.body.clientWidth / 2) - this.width / 2 + "px";
    this.d.style.top = (document.body.clientHeight / 2 ) - this.height / 2 + "px";
    this.d.style.position = "absolute";
    this.d.style.textAlign = "center";
    this.d.style.backgroundColor = "#ffffff";
    }
    remove(){
        this.wr.style.display = "none";
        this.d.style.display = "none";
    }
    show(){
        this.wr.style.display = "block";
        this.d.style.display = "block";
    }
}

var frameBuffer = []; // not in use yet, code commented and incomplete
var gameLoopId = setInterval(gameLoop, fps);

// what to draw
class Ball{
    constructor(radius){
        this.ctx = canvas.ctx;
        this.radius = radius;
        this.x = canvas.width / 2; // start centered
        this.y = canvas.height / 2;
        this.moveDown = false;
        this.moveUp = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.speed = 10; // need to tweak that
    }
    move(){ // for now wrap aroud edge
        this.coordHasChange = false;
        if(this.moveUp){
            this.y + this.speed < 0? this.y = document.body.clientHeight: this.y -= this.speed;
            this.coordHasChange = true;
        }
        if(this.moveDown){
            this.y + this.speed > document.body.clientHeight? this.y = 0 : this.y += this.speed;
            this.coordHasChange = true;
        }
        if(this.moveRight){
            this.x + this.speed > document.body.clientWidth? this.x = 0: this.x += this.speed;
            this.coordHasChange = true;
        }
        if(this.moveLeft){
            this.x + this.speed < 0? this.x = document.body.clientWidth : this.x -= this.speed;
            this.coordHasChange = true;
        }
        if(this.coordHasChange){
            //frameBuffer.push(this);
        }
    }
    draw(){
        this.ctx.fillStyle = "green";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 360);
        this.ctx.fill();
    }
    changeSpeed(e){
        this.speed = parseInt(e.target.value, 10); // numberfield return string??? WTF 
    }
}// end class Ball
var ball = new Ball(20);
window.msg = new ShowMsg("Game Pause");
window.msg.show();

function mindControled(){
    if (window.ghostDuration > 0){
        ball.x += rng(0,1) ? rng(-5,-1) : rng(1,5);
        ball.y += rng(0,1) ? rng(-5,-1) : rng(1,5);

        window.ghostDuration -= 1;
    }
    else{
        clearInterval(window.ghostId);
        window.ghostId = undefined;
        ball.speed = ball.speed * 2; // restore initial speed. Ghost controlled half the speed
    }
}

function gameLoop(){
    //canvas.ctx.fillStyle = "white";
    canvas.ctx.clearRect(0,0,canvas.width, canvas.height);
    if(gameLoopOn){
        // update canvas
        // draw frame
        ball.move();
        ball.draw();
        for(let i = 0; i < frameBuffer.length; i++){
            //frameBuffer[i].draw();
            // TODO append what ever else. Ex.: ennemi, wall ... buffSpeed, ...
        }
    }
    else{
        clearInterval(gameLoopId);
        gameLoopId = null;
        window.msg.show();
    }
    return; // for now want a way to stop infinite loop if happen, and stop de gameLoop ... need to rethink that
}