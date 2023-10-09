// IMPORTANT: 
// All properties starting with a '_' should be a protected one,
// that is, it should not be used outside the class itself and its child classes.

import Renderer from "../graphics/renderer.js";
import Scene from "./scene.js";
import InputHandler from "../inputs/input-handler.js";

export default class Game{

    #delta = 0;
    #scenes = new Map();
    #triggers = [];
    #requestID;
    #startTime;
    #lastTime;
    #renderer;
    #inputs;

    static #WIDTH = 24;
    static #HEIGHT = 24;
    constructor()
    {
        this.canvasElm = document.createElement("canvas");
        this.ctx = this.canvasElm.getContext("2d");
        this.#renderer = new Renderer(this.ctx, Game.#WIDTH, Game.#HEIGHT);
        this.canvasElm.width = this.#renderer.width*this.#renderer.charSpacing;
        this.canvasElm.height = this.#renderer.height*this.#renderer.lineHeight;
        document.body.appendChild(this.canvasElm);
        this.curSceneId = null;
        this.#inputs = new InputHandler();
        this.#lastTime = 0;
        this.fps = 60;
        this.running = false;
        this.#scenes.set("main", new Scene({
            canvas: this.canvasElm,
            inputs: this.#inputs
        }));
        this.curSceneId = "main";
        this.#inputs.onInteract = ()=>
        {
            this.#startTime = performance.now();
            this.start();
        }
        this.#inputs.addCheckInteractivityListeners();
    }
    update()
    {
        for(let i = 0;i<this.#triggers.length;i++)
        {
            if(this.#scenes.get(this.#triggers[i].from) === this.#scenes.get(this.curSceneId))
            {
                if(this.#triggers[i].condition())
                {
                    this.#triggers[i].callBack();
                    this.enterScene(this.#triggers[i].to);
                    break;
                }
            }
        }

        const scene = this.#scenes.get(this.curSceneId);

        if(!scene) return;
        
        scene.preUpdate(this.#inputs)
        scene.update(this.#inputs);
    }
    render()
    {
        if(!this.#scenes.get(this.curSceneId)) return;
        this.#scenes.get(this.curSceneId).preRender(this.#renderer);
        this.#scenes.get(this.curSceneId).render(this.#renderer);
        this.#scenes.get(this.curSceneId).posRender(this.#renderer);
    }
    /**
     * 
     * @param {string} name 
     * @param {Scene} scene 
     */
    setScene(name, scene)
    {
        this.#scenes.set(name, scene);
    }
    /**
     * 
     * @param {string} name 
     */
    removeScene(name)
    {
        this.#scenes.delete(name);
    }
    /**
     * 
     * @param {string} name 
     */
    enterScene(name)
    {
        this.curSceneId = name;
        this.#scenes.get(name).start();
    }
    clearScenes()
    {
        this.#scenes.clear();
    }
    /**
     * 
     * @param {string} name 
     * @returns {Scene}
     */
    getScene(name)
    {
        return this.#scenes.get(name);
    }
    /**
     * 
     * @param {Scene} from 
     * @param {Scene} to 
     * @param {void} condition 
     * @param {void} callBack 
     */
    addChangeSceneTrigger(from, to, condition, callBack = ()=>{})
    {
        this.#triggers.push({
            from: from,
            to: to,
            condition: condition,
            callBack: callBack
        });
    }
    #loop = (timeStamp)=>
    {
        timeStamp -= this.#startTime;
        // if is not running do nothing
        if(!this.running) return;

        let interval = 1000/this.fps;

        let now = timeStamp;

        // add to the delta the amount of time between each loop iteration
        this.#delta += now-this.#lastTime;

        this.#lastTime = now;

        // while the necessary amount of time has passed, run the game and decrease the delta by the necessary amount of time
        while(this.#delta>=interval)
        {
            this.#delta-=interval;
            this.update();
            this.render();
        }

        this.#requestID = requestAnimationFrame(this.#loop);
    }
    start()
    {
        this.running = true;
        requestAnimationFrame(this.#loop);
        window.onfocus = ()=>
        {
            this.#lastTime = performance.now();
            this.#delta = 0;
        }
    }
    stop()
    {
        this.running = false;
        cancelAnimationFrame(this.#requestID);
    }

    get inputs()
    {
        return this.#inputs;
    }

    static get WIDTH()
    {
        return this.#WIDTH;
    }
    static get HEIGHT()
    {
        return this.#HEIGHT;
    }

}