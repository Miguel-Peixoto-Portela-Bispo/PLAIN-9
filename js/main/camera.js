import Vector from "../util/vector.js";

export default class Camera{

    #position;
    constructor(x, y)
    {
        this.#position = new Vector(x, y);
    }

    get position()
    {
        return this.#position;
    }
    /**
     * @param {Vector} pos 
     */
    set position(pos)
    {
        this.#position = pos;
    }
}