import Color from "./color.js";

class CharNode{

    /**
     * 
     * @param {string} char 
     * @param {Color} color 
     * @param {Color} bgColor 
     */
    constructor(char, color, bgColor)
    {
        this.char = char.charAt(0);
        this.color = color;
        this.bgColor = bgColor;
    }
}

export default class Renderer{

    static #VOID = ' ';
    #ctx;
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} width 
     * @param {number} height 
     */
    #width;
    #height;
    constructor(ctx, width, height)
    {
        this.#ctx = ctx;

        this.#width = width;
        this.#height = height;
        this.fontSize = 30;
        this.lineHeight = this.fontSize*1.05;
        this.charSpacing = this.fontSize/1.57;

        this.charNodes = new Array(width*height);

        this.clearBuffer();
    }
    clearBuffer()
    {
        let node = new CharNode(Renderer.#VOID, new Color(255, 255, 255, 1), new Color(0, 0, 0, 1));

        this.charNodes.fill(node);
    }
    /**
     * 
     * @param {string} char 
     * @param {Color} bgColor
     * @param {Color} color  
     */
    fillBuffer(char, color, bgColor)
    {
        let node = new CharNode(char, color, bgColor);

        this.chars.fill(node);
    }
    /**
     * 
     * @param {string} char 
     * @param {Color} color 
     * @param {Color} bgColor 
     * @param {number} x 
     * @param {number} y 
     */
    setCharNode(char, color, bgColor, x, y)
    {
        x = Math.round(x);
        y = Math.round(y);
        
        // if position is off-screen do nothing
        if(x<0||x>=this.#width||y<0||y>=this.#height) return;

        let index = x+y*this.#width;

        this.charNodes[index] = new CharNode(char, color, bgColor);
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {(null | CharNode)}
     */
    getCharNode(x, y)
    {
        // if position is off-screen do nothing
        if(x<0||x>=this.width||y<0||y>=this.height) return null;

        let index = x+y*this.width;

        return this.charNodes[index];
    }
    render()
    {
        let y = (this.#ctx.canvas.height-this.#height*this.lineHeight)/2;
        let x = (this.#ctx.canvas.width-this.#width*this.charSpacing)/2;

        // rows
        for(let yy = 0;yy<this.#height;yy++)
        {
            // collumns
            for(let xx = 0;xx<this.#width;xx++)
            {
                let yp = yy*this.lineHeight+y;
                let xp = xx*this.charSpacing+x;

                let node = this.getCharNode(xx, yy);

                this.#ctx.fillStyle = node.bgColor.getCSSString();
                this.#ctx.fillRect(xp, yp, this.charSpacing+(xx===this.#width-1?0:1), this.lineHeight+(yy===this.#height-1?0:1));

                this.#ctx.font = `600 ${this.fontSize}px mono`;
                this.#ctx.fillStyle = node.color.getCSSString();
                this.#ctx.fillText(node.char, xp, yp+this.fontSize);
            }
        }
    }
    /**
     * 
     * @param {string} char 
     * @param {Color} color 
     * @param {Color} bgColor 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    fillRect(char, color, bgColor, x, y, w, h)
    {
        // rows
		for(let yy = 0;yy<h;yy++)
		{
			// columns
			for(let xx = 0;xx<w;xx++)
			{
				let xp = xx+x;
				let yp = yy+y;
				this.setCharNode(char, color, bgColor, xp, yp);
			}
		}
    }
    /**
     * 
     * @param {string} char 
     * @param {Color} color 
     * @param {Color} bgColor 
     * @param {number} x0 
     * @param {number} y0 
     * @param {number} x1 
     * @param {number} y1 
     */
    strokeLine(char, color, bgColor, x0, y0, x1, y1)
	{
	    if(Math.abs(y1 - y0) < Math.abs(x1 - x0))
	    {
	    	// we must make this comparison to know
	    	// which variable to start with, since we must
	    	// start from left to right
	    	if(x0 > x1)
	        {
	        	 this.#plotLineLow(char, color, bgColor, x1, y1, x0, y0);
	        }
	        else
	        {
	            this.#plotLineLow(char, color, bgColor, x0, y0, x1, y1);
	        }
	    }
	    else
	    {
	    	// we must make this comparison to know
	    	// which variable to start with, since we must
	    	// start from top to bottom
	    	if(y0 > y1)
	    	{
	    		this.#plotLineHigh(char, color, bgColor, x1, y1, x0, y0);
	    	}
	    	else
	    	{
	    		this.#plotLineHigh(char, color, bgColor,  x0, y0, x1, y1);
	    	}
	    }
	}
    /*
	 * x0 = line start in x axis;
	 * y0 = line start in y axis;
	 * x1 = line end in x axis;
	 * y1 = line end in y axis;
	 * dx = x1-x0;
	 * dy = y1-y0;
	 * x = representation of a value from x0 to x1;
	 * [not actual value in code] y = ((dy/dx)*sx)+y0;
	 * [is not a real variable in the code] yk = current position in y axis;
	 * [is not a real variable in the code] distance d1 = y - yk;
	 * [is not a real variable in the code] distance d2 = yk + 1 - y;
	 * D = d1-d2;
	 * reasons for finding D:
	 * 1-know if the pixel has to be below or above the current position on the y axis (D<0: pixel below; D>=0: pixel above;)
	 * 2-know how to increment D to represent his new value
	 */
    #plotLineLow(char, color, bgColor, x0, y0, x1, y1)
    {
        let dx = x1-x0;
        let dy = y1-y0;

        if(dy < 0)
	    {
	        yi = -1;
	        dy = -dy;
	    }

	    let D = 2*dy-dx;
	    let y = y0;

        for(let x = x0;x<=x1;x++)
        {
            this.setCharNode(char, color, bgColor, x, y);

            if(D > 0)
	    	 {
	    		 y = y + yi;
	    		 D = D + (2 * (dy - dx));
	    	 }
	        else
	        {
	        	D = D + 2*dy;
	        }
        }
    }
    // same implementation of method above for the opposite axis
    #plotLineHigh(char, color, bgColor, x0, y0, x1, y1)
    {
        let dx = x1-x0;
        let dy = y1-y0;
        let xi = 1;

        if(dx<0)
        {
            xi = -1;
            dx = -dx;
        }

        let D = 2*dx-dy;
        let x = x0;

        for(let y = 0;y<=y1;y++)
        {
            this.setCharNode(char, color, bgColor, x, y);

            if(D > 0)
            {
                x = x + xi;
	    	    D = D + (2 * (dx - dy));
            }
            else
            {
                D = D+2*dx;
            }
        }
    }

    /**
     * 
     * @param {string} str 
     * @param {Color} color 
     * @param {Color} bgColor 
     * @param {number} x 
     * @param {number} y 
     */
    drawString(str, color, bgColor, x, y)
    {
        let rows = str.split("\n");
		// rows
		for(let yy = 0;yy<rows.length;yy++)
		{
			// columns
			for(let xx = 0;xx<rows[yy].length;xx++)
			{
				let xp = xx+x;
				let yp = yy+y;

                let char = rows[yy].charAt(xx);

                if(char!=' ')
				this.setCharNode(char, color, bgColor, xp, yp);
			}
		}
    }
    clearDisplay()
    {
        let canvas = this.#ctx.canvas;
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    get width()
    {
        return this.#width;
    }
    get height()
    {
        return this.#height;
    }
}