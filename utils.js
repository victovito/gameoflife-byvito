
Object.defineProperty(String.prototype, 'hashCode', {
    value: function() {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});

function canvasFitScreen(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end;
}

function clamp (value, min, max){
    return Math.min(max, Math.max(min, value));
}

class Vector2
{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    static compare(a, b){
        return a.x == b.x && a.y == b.y;
    }

    static screenCenter(){
        return new Vector2(window.innerWidth/2, window.innerHeight/2);
    }

    static zero(){
        return new Vector2();
    }

    static up(){
        return new Vector2(0, 1);
    }

    add(vector2){
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }

    sub(vector2){
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    scale(factor){
        return new Vector2(this.x * factor, this.y * factor);
    }

    floor(){
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    ceil(){
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    round(){
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    invertY(){
        return new Vector2(this.x, -this.y);
    }

    rotate(angle, pivot = Vector2.zero()){
        let point = this.sub(pivot);
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return pivot.add(
            new Vector2(
                point.x * c - point.y * s,
                point.y * c + point.x * s
            )
        );
    }

}