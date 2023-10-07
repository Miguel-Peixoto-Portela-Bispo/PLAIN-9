import Enemy from "../game-objects/enemy.js";
import Player from "../game-objects/player.js";
import Color from "../graphics/color.js";
import Renderer from "../graphics/renderer.js";
import Game from "../main/game.js";
import Scene from "../main/scene.js";
import Tile from "./tile.js";

export default class Room{

    static #WIDTH = Game.WIDTH/Tile.WIDTH;
    static #HEIGHT = Game.HEIGHT/Tile.HEIGHT;
    static #VOID_TILE_ID = 0;
    static #WALL_TILE_ID = 1;

    static #VOID_TILE = new Tile('.', false);
    static #WALL_TILE = new Tile('#', true, new Color(110, 110, 110, 1));

    #width;
    #height;

    #tiles;

    #scene;
    /**
     * 
     * @param {Scene} scene 
     * @param {string} src
     * @param {number} offsetX
     * @param {number} offsetY 
     * @param {Object} opts 
     * @param {boolean} opts.canSetPlayerPosition
     * @param {number} opts.enemyRate
     */
    constructor(scene, src, offsetX = 0, offsetY = 0, opts = {})
    {
        src = src.split("\r").join("");

        // remove floating point
        offsetX = Math.round(offsetX);
        offsetY = Math.round(offsetY);

        this.#scene = scene;
        this.#width = Room.#WIDTH;
        this.#height = Room.#HEIGHT;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.#tiles = new Array(this.width*this.height);
        this.#tiles.fill(Room.#WALL_TILE_ID);

        this.#setFromSrc(src, opts);
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        // only tiles on front of the camera will be rendered
        let right = Math.floor((this.#scene.camera.position.x+Game.WIDTH)/Tile.WIDTH);
        let left = Math.floor(this.#scene.camera.position.x/Tile.WIDTH);
        let top = Math.floor(this.#scene.camera.position.y/Tile.HEIGHT);
        let bottom = Math.floor((this.#scene.camera.position.y+Game.HEIGHT)/Tile.HEIGHT);

        if(right>=this.#width+this.offsetX/Tile.WIDTH)
        {
            right = this.#width+this.offsetX/Tile.WIDTH-1;
        }
        if(left<this.offsetX/Tile.WIDTH)
        {
            left = this.offsetX/Tile.WIDTH;
        }
        if(top<this.offsetY/Tile.HEIGHT)
        {
            top = this.offsetY/Tile.HEIGHT;
        }
        if(bottom>=this.#height+this.offsetY/Tile.HEIGHT)
        {
            bottom = this.#height+this.offsetY/Tile.HEIGHT-1;
        }

        // console.log(left, top)
        // console.log(right, bottom)
        // rows
        for(let y = top;y<=bottom;y++)
        {
            // columns
            for(let x = left;x<=right;x++)
            {
                // get the draw position
                const xp = x*Tile.WIDTH-this.#scene.camera.position.x;
                const yp = y*Tile.HEIGHT-this.#scene.camera.position.y;

                // get the raw tile position
                const getX = x;
                const getY = y;
                this.getTile(getX, getY).render(renderer, xp, yp);
            }
        }
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y
     * @returns {Tile} 
     */
    getTile(x, y)
    {
        // translate the position to be relative to offset
        x-=this.offsetX/Tile.WIDTH;
        y-=this.offsetY/Tile.HEIGHT;
        // console.log("getTile", x, y);
        // remove floating point
        x = Math.round(x);
        y = Math.round(y);

        // if position is out of bounds return void tile
        if(x<0||x>=this.#width||y<0||y>=this.#height) return Room.#VOID_TILE;

        const index = x+y*this.#width;

        switch(this.#tiles[index])
        {
            case Room.#WALL_TILE_ID:
                return Room.#WALL_TILE;
                break;
            default:
                return Room.#VOID_TILE;
                break;
        }
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} value 
     */
    setTile(x, y, value)
    {
        // remove floating point
        x = Math.round(x);
        y = Math.round(y);

        // if position is out of bounds returns
        if(x<0||x>=this.#width||y<0||y>=this.#height) return;

        const index = x+y*this.#width;

        this.#tiles[index] = value;
    }
    #setFromSrc(src, opts)
    {
        // only selects the lines with content
        const rows = src.split("\n").filter(v=>v.length>0);

        // rows
        for(let y = 0;y<rows.length;y++)
        {
            if(y>=this.#height) break;
            //columns
            for(let x = 0;x<rows[y].length;x++)
            {
                if(x>=this.#width) continue;
                const srcChar = rows[y].charAt(x);

                if(srcChar === ' '||srcChar === '.'||srcChar === 'P')
                {
                    this.#tiles[x+y*this.#width] = Room.#VOID_TILE_ID;
                }
                if(srcChar === 'P'&&opts.canSetPlayerPosition)
                {
                    for(let i = 0;i<this.#scene.objects.length;i++)
                    {
                        let o = this.#scene.getObject(i);

                        if(o instanceof Player)
                        {
                            o.position.x = x*Tile.WIDTH+this.offsetX;
                            o.position.y = y*Tile.HEIGHT+this.offsetY;
                        }
                    }
                }
                if(Math.random()<opts.enemyRate&&!this.getTile(Math.floor(x+this.offsetX/Tile.WIDTH), Math.floor(y+this.offsetY/Tile.HEIGHT)).isSolid)
                {
                    let players = [];
                    for(const o of this.#scene.objects)
                    {
                        if(o instanceof Player)
                        {
                            players.push(o);
                        }
                    }
                    this.#scene.addObject(new Enemy(this.#scene, x*Tile.WIDTH+this.offsetX, y*Tile.HEIGHT+this.offsetY, players))
                }
            }
        }
    }

    get width()
    {
        return this.#width;
    }
    get height()
    {
        return this.#height;
    }

    static get VOID_TILE_ID()
    {
        return Room.#VOID_TILE_ID;
    }
    static get WALL_TILE_ID()
    {
        return Room.#WALL_TILE_ID;
    }
    static get WIDTH()
    {
        return Room.#WIDTH;
    }
    static get HEIGHT()
    {
        return Room.#HEIGHT;
    }
}