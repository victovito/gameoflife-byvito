precision highp float;

uniform vec2 res;
uniform sampler2D tex;

void main(){
    vec2 coord = gl_FragCoord.xy;
    coord.y = res.y - coord.y;
    coord = coord + vec2(1.0, 2.0);

    if (coord.y == res.y + 1.5){
        if (coord.x == 1.5){
            for (float i = 1.5; i < 2049.0; i++){
                if (i > res.x + 1.5){
                    break;
                }
                if (texture2D(tex, vec2(i, 1.5) / (res + vec2(2.0, 2.0))).w > 0.5){
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    return;
                }
            }
        }
        if (coord.x == 2.5){
            for (float i = 1.5; i < 2049.0; i++){
                if (i > res.x + 1.5){
                    break;
                }
                if (texture2D(tex, vec2(res.x + 0.5, i) / (res + vec2(2.0, 2.0))).w > 0.5){
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    return;
                }
            }
        }
        if (coord.x == 3.5){
            for (float i = 1.5; i < 2049.0; i++){
                if (i > res.x + 1.5){
                    break;
                }
                if (texture2D(tex, vec2(i, res.y + 0.5) / (res + vec2(2.0, 2.0))).w > 0.5){
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    return;
                }
            }
        }
        if (coord.x == 4.5){
            for (float i = 1.5; i < 2049.0; i++){
                if (i > res.x + 1.5){
                    break;
                }
                if (texture2D(tex, vec2(1.5, i) / (res + vec2(2.0, 2.0))).w > 0.5){
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    return;
                }
            }
        }
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    float liveNeighbors = 0.0;
    for (float x = -1.0; x < 2.0; x++){
        for (float y = -1.0; y < 2.0; y++){
            if (!(x == 0.0 && y == 0.0)){
                if (texture2D(tex, (coord + vec2(x, y)) / (res + vec2(2.0, 2.0))).w > 0.5){
                    liveNeighbors++;
                }
            }
        }
    }

    float threshold;
    if (texture2D(tex, coord / (res + vec2(2.0, 2.0))).w > 0.5){
        threshold = 1.0;
    } else {
        threshold = 2.0;
    }

    vec4 finalColor;
    if (liveNeighbors > threshold && liveNeighbors < 4.0){
        finalColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        finalColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    
    gl_FragColor = finalColor;
}

