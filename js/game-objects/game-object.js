import Color from "../graphics/color.js";
import Renderer from "../graphics/renderer.js";
import InputHandler from "../inputs/input-handler.js";
import Scene from "../main/scene.js";
import StringMask from "../util/string-mask.js";
import Vector from "../util/vector.js";

export default class GameObject{

    /**
     * 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} text 
     */
    constructor(scene, x, y, text, color = new Color(255, 255, 255, 1), bgColor = new Color(0, 0, 0, 1))
    {
        this._scene = scene;
        this._position = new Vector(x, y);
        this.text = text;
        this._mask = new StringMask(x, y, text);
        this.color = color;
        this.bgColor = bgColor;
        this.depth = 0;
    }
    update(){}
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        if(this.text)
        {
            renderer.drawString(this.text, this.color, this.bgColor, Math.round(this.position.x)-this._scene.camera.position.x, Math.round(this.position.y)-this._scene.camera.position.y);
        }
    }
    set position(value)
    {
        this._position = value;
        this._mask.position = value;
    }
    get position()
    {
        return this._position;
    }
    get mask()
    {
        return this._mask;
    }
}