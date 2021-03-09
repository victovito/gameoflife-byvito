
let canvas;
let ctx;

/**
 * @type {World}
 */
let world;
/**
 * @type {Camera}
 */
let camera;

function start(){

    canvas = document.createElement("canvas");
    document.body.append(canvas);
    ctx = canvas.getContext("2d");

    world = new World();
    camera = new Camera();
    
    Controller.setListeners();

    Structures.loadStructures();
    
    Hud.createHud();

    About.setAbout();

    requestAnimationFrame(update);

}

function update(){
    canvasFitScreen();
    Controller.inputLoops();
    camera.draw();

    requestAnimationFrame(update);
}
