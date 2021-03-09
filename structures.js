class Structures
{

    static structures = {
        glider: {
            name: "Glider",
            description: "A 5 cells spaceship that moves in a diagonal direction.",
            data: null,
            img: null,
            path: "./structures/glider.bmp",
            loaded: false
        },
        lwss: {
            name: "Light-Weight Spaceship",
            description: "A small-sized spaceship that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/lwss.bmp",
            loaded: false
        },
        mwss: {
            name: "Middle-Weight Spaceship",
            description: "A small-sized spaceship that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/mwss.bmp",
            loaded: false
        },
        hwss: {
            name: "Heavy-Weight Spaceship",
            description: "A small-sized spaceship that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/hwss.bmp",
            loaded: false
        },
        gosperGliderGun: {
            name: "Gosper Glider Gun",
            description: "A structure that creates gliders.",
            data: null,
            img: null,
            path: "./structures/gosperglidergun.bmp",
            loaded: false
        },
        simkinGliderGun: {
            name: "Simkin Glider Gun",
            description: "A structure that creates gliders.",
            data: null,
            img: null,
            path: "./structures/simkinglidergun.bmp",
            loaded: false
        },
        pulsar: {
            name: "Pulsar",
            description: "A period 3 oscillator.",
            data: null,
            img: null,
            path: "./structures/pulsar.bmp",
            loaded: false
        },
        clock: {
            name: "Clock",
            description: "A period 4 oscillator.",
            data: null,
            img: null,
            path: "./structures/clock.bmp",
            loaded: false
        },
        clock: {
            name: "Clock",
            description: "A period 4 oscillator.",
            data: null,
            img: null,
            path: "./structures/clock.bmp",
            loaded: false
        },
        koksgalaxy: {
            name: "Kok's Galaxy",
            description: "A period 8 oscillator.",
            data: null,
            img: null,
            path: "./structures/koksgalaxy.bmp",
            loaded: false
        },
        pentadecathlon: {
            name: "Penta-Decathlon",
            description: "A period 15 oscillator.",
            data: null,
            img: null,
            path: "./structures/pentadecathlon.bmp",
            loaded: false
        },
        max: {
            name: "Max",
            description: "A pattern that grows forever.",
            data: null,
            img: null,
            path: "./structures/max.bmp",
            loaded: false
        },
        ship119P4H1V0: {
            name: "Ship 119P4H1V0",
            description: "A medium-sized spaceship that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/ship119P4H1V0.bmp",
            loaded: false
        },
        ship295P5H1V1: {
            name: "Ship 295P5H1V1",
            description: "A big-sized spaceship that moves in a diagonal direction.",
            data: null,
            img: null,
            path: "./structures/ship295P5H1V1.bmp",
            loaded: false
        },
        frothingpuffer: {
            name: "Frothing Puffer",
            description: "A medium-sized puffer train that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/frothingpuffer.bmp",
            loaded: false
        },
        dirtypuffer: {
            name: "Dirty Puffer",
            description: "A big-sized puffer train that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/dirtypuffer.bmp",
            loaded: false
        },
        glidergungeneratorship: {
            name: "Glider Gun Generator Ship",
            description: "A big-sized puffer train that moves in a orthogonal direction.",
            data: null,
            img: null,
            path: "./structures/glidergungeneratorship.bmp",
            loaded: false
        },
        sierpinski: {
            name: "Sierpinski Triangle",
            description: "The Sierpinski Triangle fractal in a really low resolution version.",
            data: null,
            img: null,
            path: "./structures/sierpinski.bmp",
            loaded: false
        },
        line: {
            name: "100 Cells Line",
            description: "A line containing 100 stacked cells.",
            data: null,
            img: null,
            path: "./structures/line.bmp",
            loaded: false
        },
        line500: {
            name: "500 Cells Line",
            description: "A line containing 500 stacked cells.",
            data: null,
            img: null,
            path: "./structures/line500.bmp",
            loaded: false
        },
        line1000: {
            name: "1000 Cells Line",
            description: "A line containing 1000 stacked cells.",
            data: null,
            img: null,
            path: "./structures/line1000.bmp",
            loaded: false
        },
        x: {
            name: "X",
            description: "A X-shaped pattern.",
            data: null,
            img: null,
            path: "./structures/x.bmp",
            loaded: false
        },
    }

    static loadStructures(){
        const loadImage = function(url, callback){
            const img = new Image();
            img.src = url;
            img.onload = function(){
                if (!img.complete){
                    callback("Could not load from " + url, null);
                } else {
                    callback(null, img);
                }
            }
        }

        for (let structure of Object.keys(this.structures)){
            loadImage(
                this.structures[structure].path, (mes, img) => {
                    if (mes){
                        console.error(mes);
                        return;
                    }
                    this.structures[structure].img = img;
                    this.structures[structure].data = Structures.generateDataFromImage(img);
                    this.structures[structure].loaded = true;
                    Hud.createStructuresButtons();
                }
            );
        }
    }

    static generateDataFromImage(img){
        let canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        
        ctx.drawImage(img, 0, 0);
        
        let data = new Array(img.width);
        for (let x = 0; x < img.width; x++){
            data[x] = new Array(img.height);
            for (let y = 0; y < img.height; y++){
                data[x][y] = ctx.getImageData(x, y, 1, 1).data[0] > 126;
            }
        }

        return data;
    }

    static getCellPositions(structure, position, orientation){

        let data = structure.data;
        let placeCoord = camera.screenPointToWorldPos(position).floor();
        let structureCenter = this.getStructureCenter(structure);

        let positions = []

        for (let x = 0; x < data.length; x++){
            for (let y = 0; y < data[0].length; y++){
                if (data[x][y]){
                    positions.push(
                        placeCoord.add(
                            new Vector2(x, y).sub(structureCenter)
                                .rotate(orientation * (Math.PI / 180)).round()
                        )
                    );
                }
            }
        }

        return positions;

    }

    static placeStructure(structure, position, orientation){
        let positions = this.getCellPositions(
            structure,
            position,
            orientation
        );

        for (let cell of positions){
            world.addLiveCell(cell);
        }
    }

    static getStructureCenter(structure){
        return new Vector2(
            structure.data.length, structure.data[0].length
        ).scale(0.5).floor();
    }

}