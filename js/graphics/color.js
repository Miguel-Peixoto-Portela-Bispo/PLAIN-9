export default class Color{

    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a 
     */
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a 
     */
    increase(r, g, b, a)
    {
        let color = new Color(this.r+r, this.g+g, this.b+b, this.a+a);
        return color;
    }
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a 
     */
    decrease(r, g, b, a)
    {
        let color = new Color(this.r-r, this.g-g, this.b-b, this.a-a);
        return color;
    }
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} a 
     */
    getCSSString()
    {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}