import Vector from "./vector.js";

export default class StringMask{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} text 
     */
    constructor(x, y, text)
    {
        this.position = new Vector(x, y);
        this.text = text;
    }
    /**
     * 
     * @param {StringMask} mask 
     */
    intersectsString(mask)
    {
        const center1 = StringMask.getStringCenter(this.text);
		const center2 = StringMask.getStringCenter(mask.text);
		
		const size1 = StringMask.getStringSize(this.text);
		const size2 = StringMask.getStringSize(mask.text);

        let dist = center1.dist(center2);

        if(!(dist<size1.length()+size2.length())) return false;

        const points1 = StringMask.getPoints(this.text);
        const points2 = StringMask.getPoints(mask.text);

        // checks if the points collided
        for(let i = 0;i<points1.length;i++)
		{
			for(let j = 0;j<points2.length;j++)
			{
				if(points1[i].x+Math.round(this.position.x) == points2[j].x+Math.round(mask.position.x)&&points1[i].y+Math.round(this.position.y) == points2[j].y+Math.round(mask.position.y))
				{
					return true;
				}
			}
		}

        return false;
    }
    /**
     * 
     * @param {string} text 
     */
    static getStringCenter(text)
    {
        const rows = text.split("\n");

        const y1 = Math.floor(rows.length/2);
        const x1 = Math.floor(rows[y1].length/2);


        return new Vector(x1, y1);
    }
    /**
     * 
     * @param {string} text 
     */
    static getStringSize(text)
    {
        const rows = text.split("\n");

        const h = rows.length;
        let w = 0;

        for(let i = 0;i<h;i++)
        {
            if(rows[i].length>w)
			{
				w = rows[i].length;
			}
        }

        return new Vector(w, h);
    }
    /**
     * @param {string} text 
     */
    static getPoints(text)
    {
        let result = [];

        const rows = text.split("\n");

        // rows
        for(let yy = 0;yy<rows.length;yy++)
        {
            // columns
            for(let xx = 0;xx<rows[yy].length;xx++)
            {
                const c = rows[yy].charAt(xx);
                if(c!=' ')
                {
                    result.push(new Vector(xx, yy));
                }
            }
        }

        return result;
    }
}