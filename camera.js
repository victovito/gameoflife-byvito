class Camera
{
    constructor(){
        this.position = new Vector2(128, 128);
        this.size = 0.01;

        this.backgroundColor = "#000000";

        this.config = {
            drawGrid: true,
            drawQuadTree: false,
        }
    }

    translate(offset){
        this.position = this.position.add(offset);
    }
    applyZoom(percent){
        this.size *= percent;
    }

    worldPosToScreenPoint(position){
        let result = position.sub(this.position).scale(1 / this.size).add(Vector2.screenCenter());
        return result;
    }

    screenPointToWorldPos(point){
        let result = point.sub(Vector2.screenCenter()).scale(this.size).add(this.position);
        return result;
    }

    worldLengthToScreenLength(length){
        return length / this.size;
    }

    screenLengthToWorldLength(length){
        return length * this.size;
    }

    drawBackground(){
        ctx.beginPath();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawGrid(){
        if (this.size > 0.2){
            return;
        }
        let width = Math.ceil(this.screenLengthToWorldLength(canvas.width)) + 1;
        let height = Math.ceil(this.screenLengthToWorldLength(canvas.height)) + 1;
        let size = this.worldLengthToScreenLength(1);
        let cornerSquare = this.worldPosToScreenPoint(this.screenPointToWorldPos(new Vector2()).floor());
        ctx.beginPath();
        let grayscale = lerp(0, 0.1, 1 - (clamp(this.size * 100, 10, 20) - 10) / 10) * 255;
        ctx.strokeStyle = `rgb(${grayscale}, ${grayscale}, ${grayscale})`;
        for (let x = 0; x < width; x++){
            ctx.moveTo(cornerSquare.x + size * x, cornerSquare.y);
            ctx.lineTo(cornerSquare.x + size * x, cornerSquare.y + size * height);
        }
        for (let y = 0; y < height; y++){
            ctx.moveTo(cornerSquare.x, cornerSquare.y + size * y);
            ctx.lineTo(cornerSquare.x + size * width, cornerSquare.y + size * y);
        }
        ctx.stroke();
    }

    drawQuadTreeLevel(quad){
        ctx.strokeStyle = "#444444";

        let verts = [
            this.worldPosToScreenPoint(quad.position.add(new Vector2(-quad.size / 2, quad.size / 2))),
            this.worldPosToScreenPoint(quad.position.add(new Vector2(quad.size / 2, quad.size / 2))),
            this.worldPosToScreenPoint(quad.position.add(new Vector2(quad.size / 2, -quad.size / 2))),
            this.worldPosToScreenPoint(quad.position.add(new Vector2(-quad.size / 2, -quad.size / 2))),
        ];

        for (let i = 0; i < 4; i++){
            ctx.beginPath();
            ctx.moveTo(verts[i].x, verts[i].y);
            ctx.lineTo(verts[(i + 1) % 4].x, verts[(i + 1) % 4].y)
            ctx.stroke();
        }
    }

    drawQuad(quad){
        let position = this.worldPosToScreenPoint(quad.position.sub(new Vector2(quad.size / 2, quad.size / 2))).sub(new Vector2(0.25, 0.25));
        let length = this.worldLengthToScreenLength(quad.size) + 0.5;
        if (length / quad.size > 1){
            ctx.imageSmoothingEnabled = false;
        } else {
            ctx.imageSmoothingEnabled = true;
        }
        ctx.drawImage(quad.canvas, position.x, position.y, length, length);
    }

    drawCellPreview(cell){
        let position = this.worldPosToScreenPoint(cell).sub(new Vector2(0.25, 0.25));
        let length = this.worldLengthToScreenLength(1) + 0.5;
        ctx.beginPath();
        ctx.fillStyle = "#444444";
        ctx.fillRect(position.x, position.y, length, length);
    }

    drawSelectedStructure(){
        if (!Controller.selectedStructure){
            return;
        }

        let positions = Structures.getCellPositions(
            Controller.selectedStructure,
            Controller.lastMousePos,
            Controller.structureOrientation
        );

        for (let cell of positions){
            this.drawCellPreview(cell);
        }

    }

    saveScreenshot(){
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        canvas.width = 1920; canvas.height = 1080; camera.draw();
        link.href = canvas.toDataURL();
        canvasFitScreen();
        link.click();
        link.delete;
    }

    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBackground();
        if (this.config.drawGrid) this.drawGrid();
        if (this.config.drawQuadTree) world.data.drawQuadTree();
        this.drawSelectedStructure();
        world.data.drawQuads();
    }
}
