import Scene from "../scene.js";
import Game from "../game.js";
import Player from "../../game-objects/player.js";
import InputHandler from "../../inputs/input-handler.js";
import Renderer from "../../graphics/renderer.js";
import World from "../../world/world.js";
import Enemy from "../../game-objects/enemy.js";
import UI from "../../graphics/ui.js";

export default class MainScene extends Scene{

    /**
     * 
     * @param {Game} game 
     */
    constructor(game)
    {
        super(game);

        this.player = new Player(this, 0, 0);
        this.addObject(this.player);
        World.getSources("https://raw.githubusercontent.com/Miguel-Peixoto-Portela-Bispo/PLAIN-9/main/assets/rooms").then(v=>
        {
            this.world = new World(this, 2, 1, v);
        });
        this.UI = new UI(this.player);
    }
    /**
     * 
     * @param {InputHandler} inputs 
     */
    update(inputs)
    {
        for(let o of this._objects)
        {
            if(o instanceof Player)
            {
                o.update(inputs, this.world?this.world.rooms:null);
            }
            else
            {
                o.update(this.world?this.world.rooms:null);
            }
        }
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        if(this.world)
        {
            this.world.render(renderer);
        }
        super.render(renderer);
        this.UI.render(renderer);
    }
}