class About
{

    static text = "";

    static setAbout(color = "#ffffff"){
        const req = new XMLHttpRequest();
        req.open("get", "./about.txt", true);
        req.onload = function(){
            if (req.status != 200){
                console.error(req.response);
            } else {
                About.text = req.response;
                About.setElements(color);
            }
        }
        req.send();
    }

    static setElements(color){
        let aboutIcon = document.createElement("div");
        aboutIcon.style.position = "absolute";
        aboutIcon.style.top = "10px";
        aboutIcon.style.left = "10px";
        aboutIcon.style.width = "30px";
        aboutIcon.style.height = "30px";
        aboutIcon.style.textAlign = "center";
        aboutIcon.style.verticalAlign = "middle";
        aboutIcon.style.color = color;
        aboutIcon.style.fontSize = "24px";
        aboutIcon.innerHTML = "?";
        aboutIcon.style.userSelect = "none";
        document.body.append(aboutIcon);
        
        let aboutDiv = document.createElement("div");
        aboutDiv.style.visibility = "hidden";
        aboutDiv.style.position = "absolute";
        aboutDiv.style.top = "10px";
        aboutDiv.style.left = "50px";
        aboutDiv.style.width = "fit-content";
        aboutDiv.style.backgroundColor = "#000";
        aboutDiv.style.borderRadius = "6px";
        aboutDiv.style.zIndex = "10";
        aboutIcon.append(aboutDiv);

        let text = document.createElement("p");
        text.style.whiteSpace = "pre-wrap"
        text.style.width = "max-content";
        text.style.maxWidth = "500px";
        text.style.textAlign = "left";
        text.style.verticalAlign = "middle";
        text.style.color = "#fff";
        text.style.fontSize = "14px";
        text.style.marginTop = "10px";
        text.style.paddingBottom = "10px";
        text.style.paddingLeft = "10px";
        text.style.paddingRight = "10px";
        text.style.userSelect = "none";
        text.innerHTML = About.text;
        aboutDiv.append(text);

        aboutIcon.onmouseover = () => {
            aboutDiv.style.visibility = "visible";
        }
        aboutIcon.onmouseout = () => {
            aboutDiv.style.visibility = "hidden";
        }
    }

}