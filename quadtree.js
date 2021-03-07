class Quad
{
    constructor(position, level){
        this.position = position;
        this.level = level;
        this.size = Math.pow(2, this.level);
        this.quads = [null, null, null, null];
        this.canvas = null;
    }

    getPointSector(point){
        if (point.x < this.position.x){
            if (point.y >= this.position.y){
                return 0;
            } else {
                return 2;
            }
        } else {
            if (point.y >= this.position.y){
                return 1;
            } else {
                return 3;
            }
        }
    }

    createChild(sector){

        if (this.level == world.webglCompute.webglInputTreeLevel){
            return null;
        }

        let newPos;
        switch (sector) {
            case 0:
                newPos = this.position.add(new Vector2(-this.size / 4, this.size / 4));
                break;
            case 1:
                newPos = this.position.add(new Vector2(this.size / 4, this.size / 4));
                break;
            case 2:
                newPos = this.position.add(new Vector2(-this.size / 4, -this.size / 4));
                break;
            case 3:
                newPos = this.position.add(new Vector2(this.size / 4, -this.size / 4));
                break;
            default:
                return;
        }
        this.quads[sector] = new Quad(
            newPos,
            this.level - 1
        )
        if (this.quads[sector].level == world.webglCompute.webglInputTreeLevel){
            let canvas = document.createElement("canvas");
            canvas.width = this.quads[sector].size; canvas.height = this.quads[sector].size;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.quads[sector].canvas = canvas;
        }
        return this.quads[sector];
    }

    getAllRegions(level){
        let array = [];
        if (this.level == level){
            array.push(this);
            return array;
        }
        for (let child of this.quads){
            if (child){
                array = array.concat(child.getAllRegions(level));
            }
        }
        return array;
    }

    getRegionOnPoint(level, point){
        if (this.level == level){
            return this;
        } else {
            let quad = this.getPointSector(point);
            if (this.quads[quad] != null){
                return this.quads[quad].getRegionOnPoint(level, point);
            } else {
                return null;
            }
        }
    }

    excuteForEverySmallest(func){
        if (this.level == 1){
            for (let child of this.quads){
                if (child){
                    func(child, true);
                }
            }
            return;
        }

        for (let child of this.quads){
            if (child){
                child.excuteForEverySmallest(func);
            }
        }
    }

    setSmallestChildOnPoint(point){
        let quad = this.getPointSector(point);
        if (this.level != world.webglCompute.webglInputTreeLevel){
            if (this.quads[quad] == null){
                this.createChild(quad);
            }
            this.quads[quad].setSmallestChildOnPoint(point);
        } else {
            let localPosition = point.sub(this.position.sub(new Vector2(this.size / 2, this.size / 2)));
            let ctx = this.canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(localPosition.x, localPosition.y, 1, 1);
        }
    }

    deleteValueOnPoint(point){
        let quad = this.getPointSector(point);
        if (this.level != world.webglCompute.webglInputTreeLevel){
            if (this.quads[quad] != null){
                this.quads[quad].deleteValueOnPoint(point);
            }
        } else {
            let localPosition = point.sub(this.position.sub(new Vector2(this.size / 2, this.size / 2)));
            let ctx = this.canvas.getContext("2d");
            ctx.clearRect(localPosition.x, localPosition.y, 1, 1);
        }
    }

    createSmallestChildOnPoint(point){
        let quad = this.getPointSector(point);
        if (this.level != world.webglCompute.webglInputTreeLevel){
            if (this.quads[quad] == null){
                this.createChild(quad);
            }
            return this.quads[quad].createSmallestChildOnPoint(point);
        } else {
            return this;
        }
    }

    drawQuads(){
        if (this.level == world.webglCompute.webglInputTreeLevel){
            camera.drawQuad(this);
            return;
        }
        for (let child of this.quads){
            if (child){
                child.drawQuads();
            }
        }
    }

    drawQuadTree(){
        if (this.size < camera.size){
            return;
        }

        camera.drawQuadTreeLevel(this);
        if (this.level == 1){
            return;
        }
        for (let child of this.quads){
            if (child){
                child.drawQuadTree();
            }
        }
    }

}