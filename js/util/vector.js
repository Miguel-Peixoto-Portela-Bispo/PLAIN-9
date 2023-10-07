export default class Vector{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    /**
     * 
     * @param {Vector} vector 
     * @returns {Vector}
     */
    sub(vector)
    {
        return new Vector(this.x-vector.x, this.y-vector.y);
    }
    /**
     * 
     * @param {Vector} vector 
     * @returns {Vector}
     */
    add(vector)
    {
        return new Vector(this.x+vector.x, this.y+vector.y);
    }
    /**
     * 
     * @param {number} num 
     * @returns {Vector}
     */
    mult(num)
    {
        return new Vector(this.x*num, this.y*num);
    }
    unit(){
        if(this.length() === 0){
            return new Vector(0,0);
        } else {
            return new Vector(this.x/this.length(), this.y/this.length());
        }
    }
    /**
     * 
     * @param {Vector} vector 
     * @returns {number}
     */
    dist(vector)
    {
        let x = vector.x-this.x;
        let y = vector.y-this.y;
        return Math.hypot(x, y);
    }
    /**
     * 
     * @returns {number}
     */
    length()
    {
        return Math.hypot(this.x, this.y);
    }
    /**
     * 
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns 
     */
    static dot(v1, v2){
        return v1.x*v2.x + v1.y*v2.y;
    }
}