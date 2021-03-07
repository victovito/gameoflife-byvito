class Hud
{

    static sprites = {
        play: {
            path: "./sprites/play.png",
            sprite: null
        },
        pause: {
            path: "./sprites/pause.png",
            sprite: null
        },
        next: {
            path: "./sprites/next.png",
            sprite: null
        },
        clear: {
            path: "./sprites/clear.png",
            sprite: null
        }
    }

    static playPauseButton;
    static playPauseSize = 40;

    static nextButton;
    static nextButtonSize = 30;

    static clearButton;
    static clearButtonSize = 30;

    static calcTimeDebug;
    static calcTimeTextSize = 12;
    static calcTimeTimeout = null;

    static structuresDiv;
    static structuresDivSize = [500, 80];

    static structureInfo;
    static structureInfoSize = [100, 100];
    
    static createHud(){

        this.loadSprites();

        let playPauseButton = document.createElement("canvas");
        playPauseButton.classList.add("button");
        playPauseButton.width = this.playPauseSize;
        playPauseButton.height = this.playPauseSize;
        playPauseButton.style.marginLeft = `${-this.playPauseSize / 2}px`;
        document.body.append(playPauseButton);
        this.playPauseButton = playPauseButton;

        let nextButton = document.createElement("canvas");
        nextButton.classList.add("button");
        nextButton.width = this.nextButtonSize;
        nextButton.height = this.nextButtonSize;
        nextButton.style.marginLeft = `${this.playPauseSize / 2 + 20}px`;
        document.body.append(nextButton);
        this.nextButton = nextButton;

        let clearButton = document.createElement("canvas");
        clearButton.classList.add("button");
        clearButton.width = this.clearButtonSize;
        clearButton.height = this.clearButtonSize;
        clearButton.style.marginLeft = `${-this.playPauseSize / 2 - 20 - this.clearButtonSize}px`;
        document.body.append(clearButton);
        this.clearButton = clearButton;

        let calcTimeDebug = document.createElement("div");
        calcTimeDebug.classList.add("text");
        calcTimeDebug.style.right = `0px`;
        calcTimeDebug.style.top = `0px`;
        calcTimeDebug.style.marginTop = `5px`;
        calcTimeDebug.style.marginRight = `10px`;
        calcTimeDebug.style.textAlign = "right";
        calcTimeDebug.style.fontSize = `${this.calcTimeTextSize}px`;
        document.body.append(calcTimeDebug);
        this.calcTimeDebug = calcTimeDebug;

        let structuresDiv = document.createElement("div");
        structuresDiv.id = "structures-div";
        structuresDiv.classList.add("structures");
        structuresDiv.style.visibility = "hidden";
        structuresDiv.style.top = `${10}px`;
        structuresDiv.style.width = `${this.structuresDivSize[0]}px`;
        structuresDiv.style.height = `${this.structuresDivSize[1]}px`;
        structuresDiv.style.marginLeft = `${-this.structuresDivSize[0] / 2}px`;
        document.body.append(structuresDiv);
        this.structuresDiv = structuresDiv;
        
        let minimizeStructuresDivButton = document.createElement("button");
        minimizeStructuresDivButton.id = "min-struct-div";
        minimizeStructuresDivButton.classList.add("structures-min-button");
        minimizeStructuresDivButton.style.width = `${30}px`;
        minimizeStructuresDivButton.style.height = `${20}px`;
        minimizeStructuresDivButton.style.top = structuresDiv.style.top;
        minimizeStructuresDivButton.style.marginLeft = `${-15}px`;
        minimizeStructuresDivButton.state = "min";
        minimizeStructuresDivButton.innerHTML = "▼";
        minimizeStructuresDivButton.onclick = function(){
            if (minimizeStructuresDivButton.state == "min"){
                minimizeStructuresDivButton.style.top = `${12 + Hud.structuresDivSize[1]}px`;
                structuresDiv.style.visibility = "visible";
                minimizeStructuresDivButton.innerHTML = "▲";
                minimizeStructuresDivButton.state = "max";
                return;
            }
            if (minimizeStructuresDivButton.state == "max"){
                minimizeStructuresDivButton.style.top = structuresDiv.style.top;
                structuresDiv.style.visibility = "hidden";
                minimizeStructuresDivButton.innerHTML = "▼";
                minimizeStructuresDivButton.state = "min";
                return;
            }
        };
        document.body.append(minimizeStructuresDivButton);

        let structureInfo = document.createElement("span");
        structureInfo.id = "structure-info";
        structureInfo.classList.add("structure-info");
        document.body.append(structureInfo);
        this.structureInfo = structureInfo;

        this.setUpListeners();

    }

    static createStructuresButtons(){
        const structuresDiv = document.getElementById("structures-div");

        for (let key of Object.keys(Structures.structures)){
            if (!Structures.structures[key].loaded){
                return;
            }
        }

        for (let key of Object.keys(Structures.structures)){
            const structure = Structures.structures[key];

            let structureButton = document.createElement("button");
            structureButton.classList.add("structureButton");
            structureButton.style.width = `${this.structuresDivSize[1] - 10}px`;
            structureButton.style.height = `${this.structuresDivSize[1] - 10}px`;
            structureButton.style.marginLeft = `${2.5}px`;
            structureButton.style.marginRight = `${2.5}px`;
            structureButton.style.backgroundImage = `url(${structure.img.src})`;
            if (Math.max(structure.img.width, structure.img.height) < this.structuresDivSize[1]){
                structureButton.style.imageRendering = "pixelated";
            } else {
                structureButton.style.imageRendering = "crisp-edges";
            }
    
            structureButton.onclick = () => {
                Controller.selectedStructure = structure;
            };
            structureButton.onmouseover = () => {
                this.showStructureInfo(structure, structureButton);
            };
            structureButton.onmouseout = () => {
                this.hideStructureInfo();
            };

            structuresDiv.append(structureButton);
        }
    }

    static showStructureInfo(structure, button){
        const rect = button.getBoundingClientRect();
        
        this.structureInfo.style.left = `${rect.x + rect.width / 2 - this.structureInfoSize[0]}px`;
        this.structureInfo.style.top = `${rect.y + rect.height + 15}px`;
        this.structureInfo.style.visibility = "visible";

        this.structureInfo.innerHTML = `${structure.name}</br></br>${structure.description}`;

    }

    static hideStructureInfo(){
        this.structureInfo.style.visibility = "hidden";
    }

    static loadSprites(){
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

        for (let sprite of Object.keys(this.sprites)){
            loadImage(
                this.sprites[sprite].path, (mes, img) => {
                    if (mes){
                        console.error(mes);
                        return;
                    }
                    this.sprites[sprite].sprite = img;
                    this.drawHud();
                }
            );
        }
    }

    static setUpListeners(){

        this.playPauseButton.addEventListener("click", () => {
            world.toggleInterval();
        });

        this.nextButton.addEventListener("click", () => {
            if (world.interval == null){
                let start = Date.now();
                world.calculateGen();
                Hud.updateCalcTimeDebug(Date.now() - start);
            }
        });

        this.clearButton.addEventListener("click", () => {
            world.clear();
            if (world.interval != null){
                world.toggleInterval();
            }
        });

    }

    static drawHud(){

        this.drawPlayPauseButton();
        this.drawNextButton();
        this.drawClearButton();

    }

    static drawPlayPauseButton(){
        let ctx = this.playPauseButton.getContext("2d");

        ctx.clearRect(0, 0, this.playPauseSize, this.playPauseSize);
        let icon;
        if (world.interval != null){
            icon = this.sprites.pause.sprite;
        } else {
            icon = this.sprites.play.sprite;
        }

        if (!icon){
            return;
        }

        ctx.beginPath();
        ctx.drawImage(icon, 0, 0, this.playPauseSize, this.playPauseSize);
    }

    static drawNextButton(){
        let ctx = this.nextButton.getContext("2d");
        ctx.clearRect(0, 0, this.nextButtonSize, this.nextButtonSize);

        if (!this.sprites.next.sprite){
            return;
        }

        ctx.beginPath();
        ctx.drawImage(this.sprites.next.sprite, 0, 0, this.nextButtonSize, this.nextButtonSize);
    }

    static drawClearButton(){
        let ctx = this.clearButton.getContext("2d");
        ctx.clearRect(0, 0, this.clearButtonSize, this.clearButtonSize);

        if (!this.sprites.clear.sprite){
            return;
        }

        ctx.beginPath();
        ctx.drawImage(this.sprites.clear.sprite, 0, 0, this.clearButtonSize, this.clearButtonSize);
    }

    static updateCalcTimeDebug(value){
        if (this.calcTimeTimeout != null){
            clearTimeout(this.calcTimeTimeout);
        }
        this.calcTimeTimeout = setTimeout(() => {
            this.calcTimeDebug.innerHTML = " ";
        }, 2000);

        this.calcTimeDebug.innerHTML = `${value}ms`;
    }

}