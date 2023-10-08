import Player from "../game-objects/player.js";
import Game from "../main/game.js";
import Color from "./color.js";
import Renderer from "./renderer.js";

export default class UI{

    /**
     * 
     * @param {Player} player 
     */
    constructor(player)
    {
        this.player = player;
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        // invincible meter bar
        const invincibleBarBase = Game.WIDTH/3;
        const invicibleBarWidth = this.player.invincibleMeter/this.player.maxInvincibleMeter*invincibleBarBase;
        renderer.fillRect('*', new Color(255, 255, 255, 1), new Color(0, 255, 255, 1), Math.floor((Game.WIDTH- invincibleBarBase)/2), Math.floor(Game.HEIGHT/4), Math.floor(invicibleBarWidth), 1);

        //health points bar
        const healthBarBase = Game.WIDTH/2;
        const healthBarWidth = this.player.healthPoints/this.player.maxHealthPoints*healthBarBase;
        renderer.fillRect("♥", new Color(255, 255, 255, 1), new Color(255, 0, 0, 1), (Game.WIDTH-healthBarBase)/2, Math.floor(Game.HEIGHT/8), healthBarWidth, 1);

        let str = "level: "+this.player.level;
        renderer.drawString(str, new Color(0, 120, 255, 1), new Color(0, 0, 0, 1), Math.floor((Game.WIDTH-str.length)/2), Math.floor(Game.HEIGHT/32));
    }
}