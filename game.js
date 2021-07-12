minHeight = 80;
maxHeight = 150;
minWidth = 60;
maxwidth = 130;
minGap = 250;
maxGap = 400;
gap = randGap();
check = false;
count1 = 0;
var myObstacles = [];
var audio = document.getElementById("audio");
var audioBG1 = document.getElementById("audioBG1");
var audioBG2 = document.getElementById("audioBG2");
var audioBG3 = document.getElementById("audioBG3");
var audioGO = document.getElementById("audioGO");
var audioCOIN = document.getElementById("audioCOIN");
var audioSTAR = document.getElementById("audioSTAR");

function startGame() {
    gamearea.start();
}

function everyinterval(n) {
    if (gamearea.frame % n == 0) return true;
    return false;
}

function jump() {
    if (player.y == 400) {
        player.speedY = -3;
        if (!stop()) {
            audio.play();
        }
    }
}

function randGap() {
    return Math.floor(minGap + Math.random() * (maxGap - minGap + 1))
}

function Rnd() {
    return Math.floor(Math.random() * 25);
}

var scoreText = {
    x: 950,
    y: 50,
    update: function (text) {
        gamearea.context.fillStyle = "white"
        gamearea.context.font = "30px Consolas";
        gamearea.context.fillText(text, this.x, this.y);
    }
}

var player = {
    x: 50,
    y: 400,
    speedY: 0,
    update: function () {
        var image = document.getElementById("pepe");
        gamearea.context.drawImage(image, this.x, this.y, 80, 100);
    },
    newPos: function () {
        if (this.y < 150) {
            this.speedY = 2;
        }
        this.y += this.speedY;
        if (this.speedY == 2 && this.y == 400) {
            this.speedY = 0;
        }
    },
    crashWidth: function (obs) {
        if (this.x + 40 > obs.x && this.x < obs.x + obs.width - 10 && this.y + 90 > obs.y && this.y < obs.y + obs.height) {
            return true;
        }
        return false;
    }
}

function obstacle(rnd) {
    if(check == true && rnd == 1) {
        rnd = Rnd();
    }
    this.x = 1200;
    if (rnd == 1) {
        var image = document.getElementById("lechon");
        this.height = 100;
        this.width = 200;
        this.y = gamearea.canvas.height - 200;
    } else if (rnd == 2) {
        var image = document.getElementById("adobo");
        this.height = 70;
        this.width = 100;
        this.y = gamearea.canvas.height - 250;
    } else {
        fly = false;
        pick = Math.floor(Math.random() * 2);
        flypick = Math.floor(Math.random() * 2);
        if (gamearea.score > 2000 && gamearea.score < 5000) {
            if (pick == 1) {
                var image = document.getElementById("vol2");
            } else {
                var image = document.getElementById("birdy");
                fly = true;
            }
        } else if (gamearea.score > 5000) {
            if (pick == 1) {
                var image = document.getElementById("vol3.2");
            } else {
                fly = true;
                if (flypick == 1) {
                    var image = document.getElementById("d1");
                } else {
                    var image = document.getElementById("d2");
                }
            }
        } else {
            if (pick == 1) {
                var image = document.getElementById("cactus");
            } else {
                var image = document.getElementById("rock");
            }
        }

        this.height = Math.floor(minHeight + Math.random() * (maxHeight - minHeight + 1));
        this.width = Math.floor(minWidth + Math.random() * (maxwidth - minWidth + 1));
        if (fly == false) {
            this.y = gamearea.canvas.height - this.height;
        } else {
            h = [250, this.height];
            ind = Math.floor(Math.random() * 2);
            this.y = gamearea.canvas.height - h[ind];
        }

    }
    this.draw = function () {
        gamearea.context.drawImage(image, this.x, this.y, this.width, this.height);
    }
}

var gamearea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.height = 500;
        this.canvas.width = 1200;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context = this.canvas.getContext("2d");
        this.canvas.style.background = "url('background1.png')";
        this.canvas.style.backgroundSize = "1500px 700px";
        this.frame = 0;
        this.score = 0;
        scoreText.update("Score: ");
        this.interval = setInterval(this.updateGameArea, 5);
        window.addEventListener("keypress", jump);
    },

    updateGameArea: function () {
        if(count1 == 0) {
            audioBG1.play();
            count1 += 1;
        }
        for (i = 0; i < myObstacles.length; i++) {
            if (player.crashWidth(myObstacles[i])) {
                if (myObstacles[i].width == 200 && myObstacles[i].height == 100) {
                    audioSTAR.play();
                    myObstacles.splice(i, 1);
                    check = true;
                    audioBG1.volume = 0.1;
                    audioBG2.volume = 0.1;
                    audioBG3.volume = 0.1;
                    setTimeout(function () {
                        audioBG1.volume = 1;
                        audioBG2.volume = 1;
                        audioBG3.volume = 1;
                        check = false;
                    }, 4800);
                } else if (myObstacles[i].width == 100 && myObstacles[i].height == 70) {
                    audioCOIN.play();
                    myObstacles.splice(i, 1);
                    gamearea.score += 100;
                } else {
                    if (check == false) {
                        gamearea.stop();
                        return;
                    }
                }
            }
        }
        gamearea.clear();
        if (everyinterval(gap)) {
            temprand = Rnd();
            myObstacles.push(new obstacle(temprand));
            if (temprand == 8 || temprand == 9) {
                myObstacles.push(new obstacle(2));
            }
            gap = randGap();
            gamearea.frame = 0;
        }
        temp = 2;
        temp2 = 0.01;
        curspeed = -0.001;
        for (i = 0; i < myObstacles.length; i++) { //obstacle speed
            myObstacles[i].x -= temp;
            myObstacles[i].draw();
            gamearea.score += temp2;
            if (check == true) {
                temp += 0.8;
                temp2 += 0.005;
                curspeed += -10
            } else {
                temp += 0.2;
                temp2 += 0.0005;
                curspeed += -1;
            }
            if (gamearea.score > 2000 && gamearea.score < 5000) {
                gamearea.level2();
            } else if (gamearea.score > 5000) {
                gamearea.level3();
            }

        }
        player.newPos();
        player.update();
        gamearea.frame += 1;
        upscore = Math.floor(gamearea.score);
        scoreText.update("Score: " + upscore);
    },
    clear: function () {
        gamearea.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },
    stop: function () {
        clearInterval(this.interval);
        audioGO.play();
        audioBG1.pause();
        audioBG2.pause();
        audioBG3.pause();
        this.canvas.style.animationPlayState = 'paused';
        setTimeout(function () {
            window.location.replace("go.html");
        }, 6000);
    },
    level2: function () {
        count2 = 0
        if (count2 == 0) {
            audioBG1.pause();
            audioBG2.play();
            this.canvas.style.background = "url('background2.png')";
            this.canvas.style.backgroundSize = "1500px 700px";
            count2 += 1;
        }
    },
    level3: function () {
        count3 = 0
        if (count3 == 0) {
            audioBG1.pause();
            audioBG2.pause();
            audioBG3.play();
            this.canvas.style.background = "url('background3.png')";
            this.canvas.style.backgroundSize = "1500px 700px";
            count3 += 1;
        }
    }
}