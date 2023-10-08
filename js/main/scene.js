import GameObject from "../game-objects/game-object.js";
import Renderer from "../graphics/renderer.js";
import InputHandler from "../inputs/input-handler.js";
import Camera from "./camera.js";
import Game from "./game.js";

export default class Scene{

    /**
     * @param {Game} game
     */
    constructor(game)
    {
        this._game = game;
        this._objects = [];
        this.camera = new Camera(0, 0);
    }
    
    /**
     * 
     * @param {InputHandler} inputs 
     */
    preUpdate(inputs)
    {
        inputs.update();
        this._objects = this._objects.sort((a, b)=>a.depth-b.depth);
    }
    /**
     * 
     * @param {InputHandler} inputs 
     */
    update(inputs)
    {
        for(let i = 0;i<this._objects.length;i++)
        {
            this._objects[i].update();
        }
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    preRender(renderer)
    {
        renderer.clearDisplay();
        renderer.clearBuffer();
    }
    /**
     * 
     * @param {Renderer} renderer
     */
    render(renderer)
    {
        for(let i = 0;i<this._objects.length;i++)
        {
            this._objects[i].render(renderer);
        }
    }
    /**
     * 
     * @param {Renderer} renderer
     */
    posRender(renderer)
    {
        renderer.render();
    }
    /**
     * 
     * @param {GameObject} o 
     */
    addObject(o)
    {
        this._objects.push(o);
    }
    /**
     * 
     * @param {GameObject} o 
     */
    removeObject(o)
    {
        let index = this._objects.indexOf(o);
        this._objects.splice(index, 1);
    }
    clearObjects()
    {
        this._objects = [];
    }
    /**
     * 
     * @param {number} index 
     * @returns {GameObject}
     */
    getObject(index)
    {
        return this._objects[index];
    }
    get objects()
    {
        return this._objects;
    }
    start(){}
}