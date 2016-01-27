/**
 * Created by Iliyan on 20-Jan-16.
 */
var app = app || {};

app.wizard = (function () {
    function Wizard (){
        this.floatInJumpCounter = 0;
        this.reachEndPointOfJump = false;
        this.x = 25;
        this.y = 60;
        this.height = 0; //TODO find appropriate value
        this.width = 0; //TODO find appropriate value
        this.img = new Image();
        this.img.src = 'img/wz_anim.png';
        this.imgExplode = new Image();
        this.imgExplode.src = "img/wz_explode.png";
        this.gravity = 2;
        this.jumpHeight = 20;// Maximum height in px
        this.isJumping = false; // 1 -> jumping, 0 -> not jumping
        this.frameNum = 0; // index of next sprite from sprite_wiz array that has to be drawn
        this.frameNumDead = 4;
        this.boundingBox = app.boundingBox.load(this.x,this.y,this.width, this.height);
        this.sprite = [
            app.sprite.render(this.img, 0, 0, this.img.width/4, this.img.height),
            app.sprite.render(this.img, this.img.width/4, 0, this.img.width/4, this.img.height),
            app.sprite.render(this.img, this.img.width/2, 0, this.img.width/4, this.img.height),
            app.sprite.render(this.img, this.img.width/4*3, 0, this.img.width/4, this.img.height),
            app.sprite.render(this.imgExplode, 0, 0, this.imgExplode.width/2, this.imgExplode.height),
            app.sprite.render(this.imgExplode, this.imgExplode.width/2, 0, this.imgExplode.width/2, this.imgExplode.height)
        ];
    }

    Wizard.prototype.jump = function () {
        Wizard.isJumping = true;
        if(Wizard.isJumping == 1) console.log('jump function called! isJumping = ' + Wizard.isJumping);
    };
    Wizard.prototype.update = function(isDead){
        if(!isDead) {
            if (this.reachEndPointOfJump) {
                if (this.floatInJumpCounter == 3) {
                    this.reachEndPointOfJump = false;
                    this.floatInJumpCounter = 0;
                }
                this.floatInJumpCounter++;
            } else {
                this.gravity = 2;
            }
            this.y += this.gravity;
            console.log('update function is jumping = ' + this.isJumping);
            if (Wizard.isJumping == true) {
                this.y -= 5;
                this.jumpHeight -= 2;
            }
            if (this.jumpHeight == 0) {
                this.jumpHeight = 20;
                Wizard.isJumping = false;
                this.reachEndPointOfJump = true;
                this.gravity = 0;
                this.y += this.gravity;
                if (this.y <= 20 || this.y >= 190) {
                    return false;
                } // If the wiz hits the ground/sky
            }
            return true;
        }
        return false;
    };
    Wizard.prototype.draw = function(ctx, isDead){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if(isDead) {
            this.sprite[this.frameNumDead++].draw(ctx, this.x, this.y);
            if(this.frameNumDead == this.sprite.length) {
                this.frameNumDead = 4;
            }
        } else {
            this.sprite[this.frameNum++].draw(ctx, this.x, this.y);
            if(this.frameNum == 3){
                this.frameNum = 0;
            }
        }

        console.log('Wizard drawn');
        ctx.restore();
    };

    function _wizardFloatFlying(){

    }

    return {
        load: function () {
            console.log("Created a Wizard!");
            return new Wizard();
        }
    }

}());