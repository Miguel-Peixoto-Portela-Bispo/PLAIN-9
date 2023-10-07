import Color from "../graphics/color.js";
import InputHandler from "../inputs/input-handler.js";
import Game from "../main/game.js";
import Scene from "../main/scene.js";
import Vector from "../util/vector.js";
import Room from "../world/room.js";
import Mob from "./mob.js"

export default class Player extends Mob{

    /**
     * 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y)
    {
        super(scene, x, y, 
            " O "+"\n"+
            "/|\\"+"\n"+
            "/ \\", 
            new Color(0, 120, 255, 1));
        this.inventory = new Array(3);
        this.curItemID = 0;
    }
    /**
     * 
     * @param {InputHandler} inputs 
     * @param {Room[]} rooms 
     */
    update(inputs, rooms)
    {
        let vel = new Vector(0, 0);

        if(inputs.swipeUp||inputs.getKey("ArrowUp").taped)
        {
            vel.y = -0.2;
        }
        if(inputs.swipeRight||inputs.getKey("ArrowRight").taped)
        {
            vel.x = 0.2;
        }
        if(inputs.swipeDown||inputs.getKey("ArrowDown").taped)
        {
            vel.y = 0.2;
        }
        if(inputs.swipeLeft||inputs.getKey("ArrowLeft").taped)
        {
            vel.x = -0.2;
        }

        let mult = vel.length()>1?1/vel.length():1;
        vel = vel.mult(mult);

        this.move(vel, rooms);

        const newCameraPos = this.position.sub(new Vector(Math.floor((Game.WIDTH-3)/2), Math.floor((Game.HEIGHT-3)/2)));
        this._scene.camera.position = newCameraPos;
    }
}