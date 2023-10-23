import Color from "../graphics/color.js";
import GameObject from "./game-object.js";

export default class EndPoint extends GameObject{

    constructor(scene, x, y)
    {
        super(scene, x, y, "+-+"+"\n"+
                           "|?|"+"\n"+
                           "+-+", new Color(255, 0, 255, 1));
    }
}