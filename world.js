class World
{
    constructor(){
        this.worldSize = 64;

        this.data = new Quad(Vector2.zero(), this.worldSize);
        this.nextData = new Quad(Vector2.zero(), this.worldSize);
        this.checkedCells = new Quad(Vector2.zero(), this.worldSize);

        this.interval = null;
        this.waitForNextGen = 50;

        this.webglCompute = {
            webglInputTreeLevel: 8,
            vertexShader: null,
            fragmentShader: null,
            webglCanvas: null,
            gl: null,
            program: null,
            res: null,
            uniforms: {
                resLocation: null
            },
            concluded: []
        }

        this.loadShaders();
    }

    calculateGen(){
        /** @type {Quad[]} */
        let regions = this.data.getAllRegions(this.webglCompute.webglInputTreeLevel);
        let nextDatas = [];

        let newNeighbors = [];
        let nextNeighborsData = [];
        
        for (let region of regions){

            let newData = this.getNewRegionData(region);

            /** @type {WebGLRenderingContext} */
            let gl = this.webglCompute.gl;
            let edgeData = new Uint8Array(16);
            gl.readPixels(0, 0, 4, 1, gl.RGBA, gl.UNSIGNED_BYTE, edgeData);

            if (edgeData[3] > 120){
                let point = region.position.add(new Vector2(0, -region.size));
                if (!this.data.getRegionOnPoint(this.webglCompute.webglInputTreeLevel, point)){
                    newNeighbors.push(this.data.createSmallestChildOnPoint(point));
                }
            }
            if (edgeData[7] > 120){
                let point = region.position.add(new Vector2(region.size, 0));
                if (!this.data.getRegionOnPoint(this.webglCompute.webglInputTreeLevel, point)){
                    newNeighbors.push(this.data.createSmallestChildOnPoint(point));
                }
            }
            if (edgeData[11] > 120){
                let point = region.position.add(new Vector2(0, region.size));
                if (!this.data.getRegionOnPoint(this.webglCompute.webglInputTreeLevel, point)){
                    newNeighbors.push(this.data.createSmallestChildOnPoint(point));
                }
            }
            if (edgeData[15] > 120){
                let point = region.position.add(new Vector2(-region.size, 0));
                if (!this.data.getRegionOnPoint(this.webglCompute.webglInputTreeLevel, point)){
                    newNeighbors.push(this.data.createSmallestChildOnPoint(point));
                }
            }

            let newCanvas = document.createElement("canvas");
            newCanvas.width = region.size; newCanvas.height = region.size;
            let regionCtx = newCanvas.getContext("2d");
            regionCtx.clearRect(0, 0, region.size, region.size);
            regionCtx.drawImage(newData, 0, 0);

            nextDatas.push(newCanvas);

        }

        for (let region of newNeighbors){
            let newData = this.getNewRegionData(region);
            let newCanvas = document.createElement("canvas");
            newCanvas.width = region.size; newCanvas.height = region.size;
            let regionCtx = newCanvas.getContext("2d");
            regionCtx.clearRect(0, 0, region.size, region.size);
            regionCtx.drawImage(newData, 0, 0);
            nextNeighborsData.push(newCanvas);
        }

        for (let i = 0; i < regions.length; i++){
            regions[i].canvas = nextDatas[i];
        }
        for (let i = 0; i < newNeighbors.length; i++){
            newNeighbors[i].canvas = nextNeighborsData[i];
        }

    }

    getNewRegionData(region){
        let canvas = document.createElement("canvas");
            canvas.width = region.size + 2; canvas.height = region.size + 2;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(region.canvas, 1, 1, region.size, region.size);

            for (let x = -1; x < 2; x++){
                for (let y = -1; y < 2; y++){
                    if (x == 0 && y == 0) continue;

                    let neighborRegion = this.data.getRegionOnPoint(
                        this.webglCompute.webglInputTreeLevel,
                        region.position.add(new Vector2(region.size * x, region.size * y))
                    );

                    if (!neighborRegion) continue;

                    let canvasPosition = new Vector2(1, 1)
                        .add(new Vector2(region.size * x, region.size * y));
                    
                    ctx.drawImage(neighborRegion.canvas, canvasPosition.x, canvasPosition.y, region.size, region.size);

                }
            }

            return this.webglCalculateChunkGen(canvas);
    }

    addLiveCell(position){
        this.data.setSmallestChildOnPoint(position);
    }

    deleteCell(position){
        this.data.deleteValueOnPoint(position);
    }

    clear(){
        this.data = new Quad(Vector2.zero(), this.worldSize);
    }

    toggleInterval(){
        if (!this.interval){
            this.interval = setInterval(() => {
                let start = Date.now();
                this.calculateGen();
                Hud.updateCalcTimeDebug(Date.now() - start);
            }, this.waitForNextGen);
        } else {
            clearInterval(this.interval);
            this.interval = null;
        }
        Hud.drawPlayPauseButton();
    }

    webglCalculateChunkGen(data){

        /** @type {WebGLRenderingContext} */
        let gl = this.webglCompute.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, this.webglCompute.webglCanvas.width, this.webglCompute.webglCanvas.height);

        gl.uniform2f(
            this.webglCompute.uniforms.resLocation,
            this.webglCompute.res,
            this.webglCompute.res
        );
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        return this.webglCompute.webglCanvas;

    }

    setUpWebgl(){

        if (!this.webglCompute.vertexShader || !this.webglCompute.fragmentShader){
            return;
        }

        let canvas = document.createElement("canvas");
        let res = Math.pow(2, this.webglCompute.webglInputTreeLevel);
        canvas.width = res; canvas.height = res + 1;

        let gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, this.webglCompute.vertexShader);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
            console.error(
                "Vertex shader compile error: ",
                gl.getShaderInfoLog(vs)
            );
        }

        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, this.webglCompute.fragmentShader);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
            console.error(
                "Fragment shader compile error: ",
                gl.getShaderInfoLog(fs)
            );
        }

        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.error(
                "Shader program link error: ",
                gl.getShaderInfoLog(program)
            );
        }

        gl.useProgram(program);

        let vertexBuffer = gl.createBuffer();
        let vertices = [
            -1, 1,
            -1, -1,
            1, -1,

            -1, 1,
            1, 1,
            1, -1
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vPosAttrib = gl.getAttribLocation(program, "vPos");
        gl.vertexAttribPointer(
            vPosAttrib,
            2, gl.FLOAT,
            false,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(vPosAttrib);

        let resLocation = gl.getUniformLocation(program, "res");
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this.webglCompute.webglCanvas = canvas;
        this.webglCompute.gl = gl;
        this.webglCompute.program = program;
        this.webglCompute.res = res;
        this.webglCompute.uniforms.resLocation = resLocation;

    }

    loadShaders(){
        function loadShader(url, callback){
            const req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.onload = function(){
                if (req.status != 200){
                    callback("Could not load shader from " + url);
                } else {
                    callback(null, req.responseText);
                }
            }
            req.send();
        }

        loadShader("./mains.vs.glsl", (mes, vs) => {
            if (mes){
                console.error(mes);
                return;
            }
            loadShader("./mains.fs.glsl", (mes, fs) => {
                if (mes){
                    console.error(mes);
                    return;
                }
                world.webglCompute.vertexShader = vs;
                world.webglCompute.fragmentShader = fs;
                world.setUpWebgl();
            })
        });

    }

}

