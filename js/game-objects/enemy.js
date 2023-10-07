import Color from "../graphics/color.js";
import Scene from "../main/scene.js";
import Room from "../world/room.js";
import Mob from "./mob.js";
import Player from "./player.js";
import StringMask from "../util/string-mask.js";

export default class Enemy extends Mob{

    /**
     * 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y
     * @param {Player[]} players  
     */
    constructor(scene, x, y, players)
    {
        super(scene, x, y, "(*)"+"\n"+
                           "/|\\", new Color(255, 0, 40, 1));
        this.players = players;
        this.speed = 1/8;
    }
    /**
     * 
     * @param {Room[]} rooms 
     */
    update(rooms)
    {
        const player = this.players[0];
        let vel = player.position.add(StringMask.getStringCenter(player.text)).sub(this.position);
        if(vel.length()<=8)
        {
            vel = vel.mult(vel.length()>1?1/vel.length():1).mult(this.speed);
            this.move(vel, rooms);
        }
    }
}