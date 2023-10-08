import Color from "../graphics/color.js";
import Renderer from "../graphics/renderer.js";
import InputHandler from "../inputs/input-handler.js";
import Game from "../main/game.js";
import Scene from "../main/scene.js";
import StringMask from "../util/string-mask.js";
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
        
        this.maxHealthPoints = 3;
        this.healthPoints = this.maxHealthPoints;
        this.attack = 1;
        this.defense = 2;
        this.maxExperience = 5;
        this.maxExperiencePerLevel = 3;
        this.maxHealthPointsPerLevel = 2;

        this.originalColor = this.color;
        this.invincibleTimer = 0;
        this.maxInvincibleMeter = 8;
        this.invincibleMeter = this.maxInvincibleMeter;
    }
    /**
     * 
     * @param {InputHandler} inputs 
     * @param {Room[]} rooms 
     */
    update(inputs, rooms)
    {
        this.vel = new Vector(0, 0);

        this.handleInputs(inputs);

        let mult = this.vel.length()>1?1/this.vel.length():1;
        this.vel = this.vel.mult(mult);

        this.move(this.vel, rooms);

        this.handleInvicibility();

        this.setCameraPosition();

        super.update(rooms);
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        if(this.canShow)
        {
            super.render(renderer);
        }
    }
    handleInputs(inputs)
    {
        if(inputs.swipeUp||(inputs.getKey("ArrowUp")&&inputs.getKey("ArrowUp").taped))
        {
            this.vel.y = -0.2;
        }
        if(inputs.swipeRight||(inputs.getKey("ArrowRight")&&inputs.getKey("ArrowRight").taped))
        {
            this.vel.x = 0.2;
        }
        if(inputs.swipeDown||(inputs.getKey("ArrowDown")&&inputs.getKey("ArrowDown").taped))
        {
            this.vel.y = 0.2;
        }
        if(inputs.swipeLeft||(inputs.getKey("ArrowLeft")&&inputs.getKey("ArrowLeft").taped))
        {
           this.vel.x = -0.2;
        }
        if((inputs.touchTap.doubleTaped||(inputs.getKey("Space")&&inputs.getKey("Space").taped)))
        {
            if(this.canBeInvincible&&this.canToggleInvincibility)
            {
                this.invincible = !this.invincible;
                this.canToggleInvincibility = false;
            }
        }
        else
        {
            this.canToggleInvincibility = true;
        }
    }
    setCameraPosition()
    {
        const newCameraPos = this.position.sub(new Vector(Math.floor((Game.WIDTH-3)/2), Math.floor((Game.HEIGHT-3)/2)));
        this._scene.camera.position = newCameraPos;
    }
    handleInvicibility()
    {
        if(this.invincible)
        {
            this.invincibleMeter-=1/30;
            if(this.invincibleMeter<0)
            {
                this.invincibleMeter = 0;
                this.canBeInvincible = false;
                this.invincible = false;
            }
            this.invincibleTimer++;
            if(this.invincibleTimer/2%2 === 0)
            {
                const min = 50, max = 255;
                this.color = new Color(Math.random()*(max-min)+min, Math.random()*(max-min)+min, Math.random()*(max-min)+min, 1);
            }
        }
        else
        {
            this.color = this.originalColor;
            this.invincibleMeter+=1/20;
            if(this.invincibleMeter>this.maxInvincibleMeter)
            {
                this.canBeInvincible = true;
                this.invincibleMeter = this.maxInvincibleMeter;
            }
        }
    }
    /**
     * 
     * @param {Mob} mob 
     */
    receiveDamage(mob)
    {
        if(!this.invincible)
        {
            super.receiveDamage(mob);
        }
    }
}