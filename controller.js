class Controller
{
    static m1 = null;
    static m2 = null;
    static m3 = null;

    static selectedStructure = null;
    static structureOrientation = 0;

    static lastMousePos = new Vector2();

    static inputLoops(){
        if (Controller.m1){
            if (this.selectedStructure == null){
                let pos = camera.screenPointToWorldPos(this.lastMousePos).floor();
                world.addLiveCell(pos);
            }
        }
        if (Controller.m3){
            if (this.selectedStructure != null){
                this.selectedStructure = null;
                this.structureOrientation = 0;
            } else {
                let pos = camera.screenPointToWorldPos(this.lastMousePos).floor();
                world.deleteCell(pos);
            }
        }
    }

    static setListeners(){

        canvas.addEventListener("mousedown", function(e){
            switch (e.button) {
                case 0:
                    Controller.m1 = Date.now();
                    break;
                case 1:
                    Controller.m2 = Date.now();
                    break;
                case 2:
                    Controller.m3 = Date.now();
                    break;
                default:
                    break;
            }
        });

        canvas.addEventListener("click", function (e){
            if (Controller.selectedStructure != null){
                if (Date.now() - Controller.m1 < 200){
                    Structures.placeStructure(
                        Controller.selectedStructure,
                        Controller.lastMousePos,
                        Controller.structureOrientation
                    );
                }
            }

            Controller.m1 = null;
        });

        canvas.addEventListener("mouseup", function(e){
            if (e.button == 1){
                Controller.m2 = null;
            }
        });

        // document.addEventListener("mouseup", function(e){
        //     if (e.button == 0){
        //         Controller.m1 = null;
        //     }
        // });

        document.addEventListener("mousemove", function(e){
            if (Controller.m2){
                let offset = new Vector2(e.x, e.y).sub(Controller.lastMousePos).scale(-camera.size);
                camera.translate(offset);
            }
            Controller.lastMousePos = new Vector2(e.x, e.y);
        });

        canvas.addEventListener("wheel", function(e){
            if (e.wheelDeltaY < 1){
                camera.applyZoom(1.1);
            } else {
                camera.applyZoom(0.9);
            }
        });

        canvas.addEventListener("contextmenu", function(e){
            e.preventDefault();
            // if (Date.now() - Controller.m3 < 200){
            //     let pos = camera.screenPointToWorldPos(new Vector2(e.x, e.y)).floor();
            //     let cellIndex = world.liveCells.findIndex(el => el.x == pos.x && el.y == pos.y);
            //     if (cellIndex > -1){
            //         world.liveCells.splice(cellIndex, 1);
            //     }
            // }
            Controller.m3 = null;
        });

        document.addEventListener("keypress", (e) => {
            if (e.code == "Space"){
                if (Controller.selectedStructure != null){
                    Controller.structureOrientation = (Controller.structureOrientation + 90) % 360;
                }
            }
        });

        document.addEventListener("mouseleave", (e) => {
            this.m1 = null;
            this.m2 = null;
            this.m3 = null;
        });

        document.addEventListener("keydown", (e) => {
            if (e.code == "F2"){
                camera.saveScreenshot();
            }
        });

    }

}