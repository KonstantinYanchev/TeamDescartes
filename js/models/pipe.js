/**
 * Created by Iliyan on 21-Jan-16.
 */
var app = app || {};

app.pipe = (function () {
    function Pipe (x,y,w,h, imgX,imgY){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.img = new Image();
        this.delta = 300;
        this.img.src = 'img/column+wiz.png';
        this.sprite = app.sprite.render(this.img, imgX, imgY, this.width, this.height);
        this.boundingBox = app.boundingBox.load(x,y,w,h);
    }

    Pipe.prototype.update = function() {
        this.x--;
        this.boundingBox.x--;
        if(this.x < -50) {
            this.x = 300;
            this.boundingBox.x = 300;
        }
    };

    Pipe.prototype.draw =  function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        this.sprite.draw(ctx, this.x, this.y);
        ctx.restore();
    };

    return {
        load: function(x,y,w,h, imgX, imgY){
            return new Pipe(x,y,w,h, imgX, imgY);
        }
    }
}());