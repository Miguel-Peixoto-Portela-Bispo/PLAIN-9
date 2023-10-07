import Renderer from "../graphics/renderer.js";
import Color from "../graphics/color.js";

export default class Tile{

    static #WIDTH = 3;
    static #HEIGHT = 3;
    constructor(char, isSolid, color = new Color(255, 255, 255, 1), bgColor = new Color(0, 0, 0, 1))
    {
        this.char = char;
        this.isSolid = isSolid;
        this.color = color;
        this.bgColor = bgColor;
    }
    /**
     * 
     * @param {Renderer} renderer 
     * @param {number} x 
     * @param {number} y
     */
    render(renderer, x, y)
    {
        renderer.fillRect(this.char, this.color, this.bgColor, x, y, Tile.WIDTH, Tile.HEIGHT);
    }

    static get WIDTH()
    {
        return Tile.#WIDTH;
    }
    static get HEIGHT()
    {
        return Tile.#HEIGHT;
    }
}