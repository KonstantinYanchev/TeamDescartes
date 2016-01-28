var canvas,
    ctx,
    width,
    height,
    fgpos = 0,
    frames = 0,
    score = 0,
    best = 0,
    currentState,
    states = {
        Splash: 0, Game: 1, Score: 2
    },
    restartButton,
    bird = {

        x: 60,
        y: 0,
        frame: 0,
        velocity: 0,
        animation: [0, 0],
        rotation: 0,
        radius: 12,
        gravity: 0.25,
        _jump: 4.6,

        jump: function() {
            this.velocity = -this._jump;
        },

        update: function() {
            var n = currentState === states.Splash ? 10 : 5;
            this.frame += frames % n == 0 ? 1 : 0;
            this.frame %= this.animation.length;

            if(currentState === states.Splash) {
                this.y = height - 280 + 5*Math.cos(frames / 10);
                this.rotation = 0;
            } else {
                this.velocity += this.gravity;
                this.y += this.velocity;

                if(this.y >= height - s_fg.height - 10) {
                    this.y = height - s_fg.height - 10;
                    if(currentState === states.Game) {
                        currentState = states.Score;
                    }

                    this.velocity = this._jump;
                }

                if(this.velocity >= this._jump) {
                    this.frame = 1;
                    this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
                } else {
                    this.rotation = -0.3;
                }
            }
        },

        draw: function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);


            var n = this.animation[this.frame];
            s_bird[n].draw(ctx, -s_bird[n].width / 2, -s_bird[n].height / 2);

            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
            ctx.restore();
        }
    },
    pipes = {

        _pipes: [],

        reset: function () {
            this._pipes = [];
        },

        update: function() {
            if(frames % 100 === 0) {
                var topPositionOfPipe = height - (s_pipeSouth.height + s_fg.height + 120 + 200 * Math.random());
                this._pipes.push({
                    x: 500,
                    y: topPositionOfPipe,
                    width: s_pipeSouth.width,
                    height: s_pipeSouth.height
                });
            }

            for(var i = 0, len = this._pipes.length; i < len; i++) {
                var pipe = this._pipes[i];

                if(i == 0) {

                    score += pipe.x === bird.x ? 1: 0;

                    var closestX = Math.min(Math.max(bird.x, pipe.x), pipe.x + pipe.width);
                    var closestY1 = Math.min(Math.max(bird.y, pipe.y), pipe.y + pipe.height);
                    var closestY2 = Math.min(Math.max(bird.y, pipe.y + pipe.height + 80), pipe.y + 2 * pipe.height + 80);

                    var differenceX = bird.x - closestX;
                    var differenceY1 = bird.y - closestY1;
                    var differenceY2 = bird.y - closestY2;

                    var distance1 = differenceX * differenceX + differenceY1 * differenceY1;
                    var distance2 = differenceX * differenceX + differenceY2 * differenceY2;

                    var radius = bird.radius * bird.radius;

                    if(radius > distance1 || radius > distance2) {
                        currentState = states.Score;
                    }
                }

                pipe.x -= 2;
                if(pipe.x < -50) {
                    this._pipes.splice(i, 1);
                    i--;
                    len--;
                }
            }
        },

        draw: function(ctx) {
            for(var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                s_pipeSouth.draw(ctx, p.x, p.y);
                s_pipeSouth.draw(ctx, p.x, p.y + 80 + p.height);
            }
        }
    };

    function onPress(event) {
        switch(currentState) {
            case states.Splash:
                currentState = states.Game;
                bird.jump();
                break;

            case states.Game:
                bird.jump();
                break;

            case states.Score:
                var mx = event.offsetX,
                    my = event.offsetY;

                if(restartButton.x < mx &&
                    mx < restartButton.x + restartButton.width &&
                    restartButton.y < my &&
                    my < restartButton.y + restartButton.height) {
                    pipes.reset();
                    currentState = states.Splash;
                    score = 0;
                }

                break;
        }
    }

function main() {
    canvas = document.createElement('canvas');

    width = window.innerWidth;
    height = window.innerHeight;

    var event = 'touchstart';
    if(width >= 500) {
        width = 320;
        height = 480;
        event = 'mousedown';
    }

    document.addEventListener(event, onPress);

    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    currentState = states.Splash;


    document.body.appendChild(canvas);

    var img = new Image();
    img.onload = function () {
        initSprites(this);
        ctx.fillStyle = s_bg.color;

        restartButton = {
            x: (width - s_buttons.Restart.width) / 2,
            y: height - 200,
            width: s_buttons.Restart.width,
            height: s_buttons.Restart.height,
        };
        run();
    }

    img.src = 'images/sheet.png'
}

function run() {
    var loop = function () {
        update();
        render();
        window.requestAnimationFrame(loop, canvas);
    }

    window.requestAnimationFrame(loop, canvas);
}

function update() {
    frames++;
    if(currentState !== states.Score) {
        fgpos = (fgpos - 2) % 15;
    } else {
        best = Math.max(best, score);
    }

    if(currentState === states.Game) {
        pipes.update();
    }

    bird.update();
}

function render() {
    ctx.fillRect(0, 0, width, height);
    s_bg.draw(ctx, 0, 0);
    s_bg.draw(ctx, s_bg.width, 0);

    pipes.draw(ctx);
    bird.draw(ctx);

    s_fg.draw(ctx, fgpos, height - s_fg.height);
    s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);

    var width2 = width / 2;

    if(currentState === states.Splash) {
        s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
        s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 380);
        s_text.FlappyWizard.draw(ctx, width2 - s_text.GetReady.width / 2 - 5, height - 430);
    }

    if(currentState === states.Score) {
        s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width / 2, height - 400);
        s_score.draw(ctx, width2 - s_score.width / 2, height - 340);
        s_buttons.Restart.draw(ctx, restartButton.x, restartButton.y);

        s_numberS.draw(ctx, width2 - 47, height - 304, score, 10);
        s_numberS.draw(ctx, width2 - 47, height - 262, best, 10);
    } else {
        s_numberB.draw(ctx, width2, 20, score);
    }
}

main();