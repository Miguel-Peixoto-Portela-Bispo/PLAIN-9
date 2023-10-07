import Scene from "../scene.js";
import Game from "../game.js";
import Player from "../../game-objects/player.js";
import InputHandler from "../../inputs/input-handler.js";
import Renderer from "../../graphics/renderer.js";
import World from "../../world/world.js";

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
        World.getSources("../../../assets/rooms.txt").then(v=>
        {
            this.world = new World(this, 3, 3, v);
        })
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
                o.update([]);
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
    }
}