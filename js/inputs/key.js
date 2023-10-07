export default class Key{

    #taps;
    /**
     * 
     * @param {string} code 
     */
    constructor(code)
    {
        this.#taps = 0;
        this.tapTimer = 0;
        this.depressed = true;
        this.code = code;
        this.pressed = false;
    }
    updateTap()
    {
        if(this.pressed)
        {
            this.tapTimer = 0;
        }
        if(this.pressed&&this.depressed)
        {
            this.depressed = false;
            this.#taps++;
            this.tapTimer = 0;
        }
        this.tapTimer++;
        if(this.tapTimer>8)
        {
            this.tapTimer = 0;
            this.#taps = 0;
        }
        if(this.pressed&&this.taps>0)
        {
            this.taped = true;
        }
        else 
        {
            this.taped = false;
        }
        if(this.pressed&&this.taps>1)
        {
            this.doubleTaped = true;
        }
        else 
        {
            this.doubleTaped = false;
        }
    }
    /**
     * 
     * @param {Key} key 
     * @returns {boolean}
     */
    consecutivePressWith(key)
    {
        return this.tapTimer<8&&key.taped;
    }
    /**
     * @returns {number}
     */
    get taps()
    {
        return this.#taps;
    }
}