import Button from "../../game-objects/button.js";
import Color from "../../graphics/color.js";
import Renderer from "../../graphics/renderer.js";
import InputHandler from "../../inputs/input-handler.js";
import StringMask from "../../util/string-mask.js";
import Game from "../game.js";
import Scene from "../scene.js";

export default class TitleScene extends Scene{

    #title;
    #startedPlay;
    /**
     * 
     * @param {Game} game 
     */
    constructor(game)
    {
        super(game);
        fetch("https://raw.githubusercontent.com/Miguel-Peixoto-Portela-Bispo/PLAIN-9/main/assets/title")
        .then(v=>v.text())
        .then(v=>this.#title = v);
        const btn = new Button(this, Game.WIDTH/2, 10, "play", new Color(0, 80, 255, 1), new Color(255, 255, 255, 1));
        btn.onInteract = 
        ()=>
        {
            this.#startedPlay = true;
        }
        this.addObject(btn);
    }
    /**
     * 
     * @param {InputHandler} inputs
     */
    update(inputs)
    {
        for(let i = 0;i<this.objects.length;i++)
        {
            const o = this.objects[i];
            if(o instanceof Button)
            {
                o.update(inputs);
            }
            else
            {
                o.update();
            }
        }
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        if(this.#title)
        {
            const size = StringMask.getStringSize(this.#title);
            const x = (Game.WIDTH-size.x)/2;
            const y = 2;
            renderer.drawString(this.#title, new Color(0, 80, 255, 1), new Color(0, 0, 0, 1), x, y);
        }
        super.render(renderer);
    }
    get startedPlay()
    {
        return this.#startedPlay;
    }
}