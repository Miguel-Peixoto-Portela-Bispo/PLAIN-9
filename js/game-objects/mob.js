import Color from "../graphics/color.js";
import InputHandler from "../inputs/input-handler.js";
import Vector from "../util/vector.js";
import Room from "../world/room.js";
import MobileGameObject from "./mobile-game-object.js";

export default class Mob extends MobileGameObject{

    constructor(scene, x, y, text, color = new Color(255, 255, 255, 1), bgColor = new Color(0, 0, 0, 1))
    {
        super(scene, x, y, text, color, bgColor);
        this.level = 1;
        this.attack = 1;
        this.healthPoints = 1;
        this.maxHealthPoints = 1;
        this.defense = 1;
        this.experience = 0;
        this.maxExperience = 1;
        this.maxExperiencePerLevel = 1;
        this.attackPerLevel = 1;
        this.maxHealthPointsPerLevel = 1;
        this.defensePerLevel = 1;
    }
    /**
     * 
     * @param {Room[]} rooms
     */
    update(rooms)
    {
        super.update();
        this.checkStatus();
    }
    /**
     * 
     * @param {number} maxExp 
     */
    checkStatus()
    {
        if(this.experience>=this.maxExperience)
        {
            this.experience-=this.maxExperience;
            this.maxExperience+=this.maxExperiencePerLevel;
            this.attack+=this.attackPerLevel;
            this.healthPoints+=this.healthPointsPerLevel;
            this.defense+=this.defensePerLevel;
        }
        if(this.healthPoints>this.maxHealthPointsPerLevel)
        {
            this.healthPoints = this.maxHealthPointsPerLevel;
        }
    }
    /**
     * 
     * @param {Mob} mob 
     */
    receiveDamage(mob)
    {
        let def = this.defense/2<1?1:this.defense/2;
        this.healthPoints-=mob.attack/def;
        if(this.healthPoints<0)
        {
            this.healthPoints = 0;
        }
    }
    /**
     * 
     * @param {Mob} mob 
     */
    giveDamage(mob)
    {
        mob.receiveDamage(this);
    }
}