/**
 * Created by Iliyan on 20-Jan-16.
 */
var app = app || {};

app.boundingBox = (function() {
    function BoundingBox(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    BoundingBox.prototype.contains = function(x, y) {
        return !!(x >= this.x && x <= this.x + this.width &&
        y >= this.y && y <= this.y + this.height);
    };

    BoundingBox.prototype.intersects = function(shape) {
        var offset = 40;

        if(this.contains(shape.x - offset, shape.y - offset) ||
            this.contains(shape.x + shape.width - offset, shape.y - offset)||
            this.contains(shape.x - offset, shape.y+shape.height - offset)||
            this.contains(shape.x + shape.width - offset, shape.y+shape.height - offset)) {
            return true;
        } else if(shape.contains(this.x - offset, this.y - offset) ||
            shape.contains(this.x + this.width - offset, this.y - offset)||
            shape.contains(this.x - offset, this.y + this.height - offset)||
            shape.contains(this.x + this.width - offset, this.y + this.height - offset)) {
            return true;
        }
        return false;
    };

    return {
        load: function (x, y, w, h) {
            return new BoundingBox(x, y, w, h);
        }
    }

}());