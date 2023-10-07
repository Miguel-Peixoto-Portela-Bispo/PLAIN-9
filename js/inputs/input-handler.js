import Vector from "../util/vector.js";
import Key from "./key.js";

export default class InputHandler{

    #swipeAngle;
    #touchTap
    constructor()
    {
        this.treshHold = 80;
        this.touchPos = new Vector(0, 0);
        this.#touchTap = new Key("touch");
        this.keys = [];
        document.addEventListener("touchstart", (e)=>
        {
            this.touchPos.x = e.changedTouches[0].clientX;
            this.touchPos.y = e.changedTouches[0].clientY;
            this.#touchTap.pressed = true;
        });
        document.addEventListener("touchmove", (e)=>
        {
            const pos = new Vector(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            const dist = pos.dist(this.touchPos);
            const angle = Math.atan2(pos.y-this.touchPos.y, pos.x-this.touchPos.x);
            if(dist>this.treshHold)
            {
                this.swipe = true;
                this.#swipeAngle = angle;
            }
        });
        document.addEventListener("touchend", ()=>
        {
            this.#touchTap.pressed = false;
            this.#touchTap.depressed = true;
            this.swipe = false;
        });
        document.addEventListener("mousedown", (e)=>{
            this.touchPos.x = e.clientX;
            this.touchPos.y = e.clientY;
            this.#touchTap.pressed = true;
        });
        document.addEventListener("mouseup", (e)=>{
            this.#touchTap.pressed = false;
            this.#touchTap.depressed = true;
        });
        document.addEventListener("keydown",(e)=>
        {
            let key = this.getKey(e.code);
            if(!key) return
            key.pressed = true;
        });
        document.addEventListener("keyup",(e)=>
        {
            let key = this.getKey(e.code);
            if(!key) return
            key.pressed = false;
            key.depressed = true;
        });
    }
    update()
    {
        const swipes = this.getSwipes();

        this.swipeUp = swipes.includes("up")&&this.swipe;
        this.swipeRight = swipes.includes("right")&&this.swipe;
        this.swipeDown = swipes.includes("down")&&this.swipe;
        this.swipeLeft = swipes.includes("left")&&this.swipe;

        this.touchTap.updateTap();

        this.keys.forEach((v)=>v.updateTap());
    }
    getSwipes()
    {
        let result = [];
        const piece = 360/8;
        const rotation = piece/2;
        let angle = -this.swipeAngle*180/Math.PI;
        angle = angle<0?Math.abs(angle+360):angle;

        if(angle>rotation&&angle<=rotation+piece)
        {
            result.push("up", "right");
        }
        else if(angle>rotation+piece&&angle<=rotation+piece*2)
        {
            result.push("up");
        }
        else if(angle>rotation+piece*2&&angle<=rotation+piece*3)
        {
            result.push("up", "left");
        }
        else if(angle>rotation+piece*3&&angle<=rotation+piece*4)
        {
            result.push("left");
        }
        else if(angle>rotation+piece*4&&angle<=rotation+piece*5)
        {
            result.push("down", "left");
        }
        else if(angle>rotation+piece*5&&angle<=rotation+piece*6)
        {
            result.push("down");
        }
        else if(angle>rotation+piece*6&&angle<=rotation+piece*7)
        {
            result.push("right", "down");
        }
        else if((angle>rotation+piece*7&&angle<=360)||(angle<rotation))
        {
            result.push("right");
        }

        return result;
    }
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @returns {Vector}
     */
    getTranslatedTouchPosition(canvas)
    {
        let translatedPos = new Vector(0, 0);
        let rect = canvas.getBoundingClientRect();
        translatedPos.x = (this.touchPos.x-rect.x)/(rect.width/canvas.width);
        translatedPos.y = (this.touchPos.y-rect.y)/(rect.height/canvas.height);
        return translatedPos;
    }
    /**
     * 
     * @param {string} code 
     * @returns {Key}
     */
    getKey(code)
    {
        return this.keys.find((v)=>v.code === code);
    }
    /**
     * 
     * @param {string} code 
     */
    addKey(code)
    {
        this.keys.push(new Key(code));
    }
    /**
     * 
     * @param {string} code 
     */
    removeKey(code)
    {
        let key = this.keys.find((v)=>v.code===code);
        let index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
    }
    clearKeys()
    {
        this.keys = [];
    }
    /**
     * 
     * @param {string} eventName 
     */
    checkInteractivity(eventName)
    {
        if(document.readyState === "interactive"||document.readyState === "complete")
        {
            if(!this.userInteracted)
            {
                this.userInteracted = true;
                if(typeof this.onInteract === "function")
                {
                    this.onInteract();
                }
            }
            document.removeEventListener(eventName, this.checkInteractivity);
        }
    }
    addCheckInteractivityListeners()
    {
        ["click", "mousemove", "mouseover", "mousemove", "touchmove", "focus"].forEach((v)=>
        {
            document.addEventListener(v, this.checkInteractivity(v));
        });
    }

    get swipeAngle()
    {
        return this.#swipeAngle;
    }
    get touchTap()
    {
        return this.#touchTap;
    }
}