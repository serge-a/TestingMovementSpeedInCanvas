// note There is a bug when ghost move the ball alone. The ball wrapping is not taken in consideration. The ball can disapear outside the canvas/viewport. 
// Maybe not that strange / coulb be a "feature" (not a bug)😉, after all, Ghost can move trought wall !!! (or unknow dimention: ex.: out of canvas size)
// Stop pushing 'g' and you could get back the ball with a little bit of effort, maybe?

function rng(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var canvas = document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
canvas.ctx = canvas.getContext("2d");
console.log("use arrow keys or WSAD to move the ball. Esc to pause/stop the game loop. Relaunch it with Esc");
console.log("Press g to be influenced by bad energy"); // you will be mind controlled by a ghost. But not totally, you are strong, you resist.
var fps = 1000/60; // 60 fps
var gameLoopOn = true;

document.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
    // could ad stuff here later
}, true);
document.addEventListener("keypress", (e) =>{ // keypress don't work with some key, like shift, ctrl
    switch(e.key){

        default: {
            //console.log(e.key);
        }
    }
}, true);

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
                MsgWin.remove();
            }
            break;
        }
        case "g":{
            // init ghost for a few "seconds"
            if(window.ghostDuration){ break;} // or strange thing happen when more than one ghost try to take control!!!
            ball.speed = ball.speed / 2;
            window.ghostDuration = rng(60,180); // une a trois sec
            window.ghostId = setInterval((millisecs) => {mindControled(millisecs)}, fps);
            break;
        }
        default: {
            console.log(e.key, gameLoopId);
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

function showMsg(){
    var d = document.createElement("div");
    d.innerHTML = "Game Paused";
    d.style.fontSize = "24px";
    document.body.append(d);
    var width = document.body.clientWidth / 4;
    var height = d.getBoundingClientRect().height;
    d.style.width = width + "px";
    //d.style.height = height + "px";
    d.style.left = (document.body.clientWidth /2) - width / 2 + "px";
    d.style.top = (document.body.clientHeight /2 ) - height / 2 + "px";
    d.style.position = "absolute";
    d.style.textAlign = "center";
    d.remove = function Remove(){
        document.body.removeChild(d);
    };
    window.MsgWin = d;
}

var frameBuffer = [];
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

        this.move = function Move(){ // for now wrap aroud edge
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
        };

        this.draw = function Draw(){
            this.ctx.fillStyle = "green";
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 360);
            this.ctx.fill();
        };
    }
}// end class Ball
var ball = new Ball(20);

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
    canvas.ctx.fillStyle = "white";
    canvas.ctx.clearRect(0,0,canvas.width, canvas.height);
    if(gameLoopOn){
        // update canvas
        // draw frame
        ball.move();
        ball.draw(); 
        for(let i = 0; i < frameBuffer.length; i++){
            //frameBuffer[i].draw();
            // append in that what ever else. Ex.: ennemi, wall ... buffSpeed, ...
        }
    }
    else{
        clearInterval(gameLoopId);
        gameLoopId = null;
        showMsg("GamePause");
    }
    return; // for now want a way to stop infinite loop if happen, and stop de gameLoop ... need to rethink that
}