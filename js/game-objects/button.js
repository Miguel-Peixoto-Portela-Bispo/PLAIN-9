import Color from "../graphics/color.js";
import Renderer from "../graphics/renderer.js";
import InputHandler from "../inputs/input-handler.js";
import Scene from "../main/scene.js";
import GameObject from "./game-object.js";

export default class Button extends GameObject{

    #width;
    #height;
    #originalBgColor;
    #alreadyTouched;
    #canBeTouched;
    /**
     * 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} text 
     * @param {Color} color 
     * @param {Color} bgColor 
     */
    constructor(scene, x, y, text, color = new Color(255, 255, 255, 1), bgColor = new Color(70, 70, 70, 1))
    {
        super(scene, x, y, text, color, bgColor);
        this.#originalBgColor  = bgColor;
        this.#width = text.length+2;
        this.#height = 3;
        this.position.x-=this.#width/2;
    }
    /**
     * 
     * @param {InputHandler} inputs 
     */
    update(inputs)
    {
        if(inputs.touchTap.taped&&this.#canBeTouched)
        {
            const touchPosition = inputs.getTranslatedTouchPosition(this._scene.game.canvasElm);

            const charUnitX = touchPosition.x/this._scene.game.nodeSize.x;
            const charUnitY = touchPosition.y/this._scene.game.nodeSize.y;

            // if touch position is between button bounds, do action
            if(charUnitX>=this.position.x&&
                charUnitX<=this.position.x+this.#width&&
                charUnitY>=this.position.y&&charUnitY<=this.position.y+this.#height)
            {
                this.#canBeTouched = false;
                if(this.#alreadyTouched)
                {
                    this.onInteract();
                    this.bgColor = this.#originalBgColor.decrease(
                        this.#originalBgColor.r*0.8,
                        this.#originalBgColor.g*0.8,
                        this.#originalBgColor.b*0.8,
                        0
                    );
                }
                else
                {
                    this.#alreadyTouched = true;
                    this.bgColor = this.#originalBgColor.decrease(
                        this.#originalBgColor.r*0.4,
                        this.#originalBgColor.g*0.4,
                        this.#originalBgColor.b*0.4,
                        0
                    );
                }
            }
            else
            {
                this.bgColor = this.#originalBgColor;
                this.#alreadyTouched = false;
            }
        }
        else if(!inputs.touchTap.taped)
        {
            this.#canBeTouched = true;
        }
        super.update();
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        renderer.fillRect("*", this.color, this.bgColor, Math.round(this.position.x), Math.round(this.position.y), this.#width, this.#height);

        renderer.drawString(this.text, this.color, this.bgColor, Math.round(this.position.x+1), Math.round(this.position.y+1));
    }
    onInteract(){}
    get width()
    {
        return this.#width;
    }
    get height()
    {
        return this.#height;
    }

}