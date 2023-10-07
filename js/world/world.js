import Renderer from "../graphics/renderer.js";
import Game from "../main/game.js";
import Scene from "../main/scene.js";
import Room from "./room.js";
import Tile from "./tile.js";

export default class World{

    static #SOURCE_SEPARATOR = "@\n";
    #rows;
    #cols;
    #rooms;
    /**
     * 
     * @param {Scene} scene 
     * @param {number} rows 
     * @param {number} cols 
     * @param {string[]} sources 
     * @param {number} [x=0] 
     * @param {number} [y=0] 
     */
    constructor(scene, rows, cols, sources, x = 0, y = 0)
    {
        this.scene = scene;
        this.#rows = rows;
        this.#cols = cols;
        this.#rooms = new Array(rows*cols);
        this.x = x;
        this.y = y;

        this.#createRooms(sources);
    }
    /**
     * 
     * @param {Renderer} renderer 
     */
    render(renderer)
    {
        let right = Math.floor((this.scene.camera.position.x+Game.WIDTH)/Tile.WIDTH/Room.WIDTH);
        let left = Math.floor(this.scene.camera.position.x/Tile.WIDTH/Room.WIDTH);
        let top = Math.floor(this.scene.camera.position.y/Tile.HEIGHT/Room.HEIGHT);
        let bottom = Math.floor((this.scene.camera.position.y+Game.HEIGHT)/Tile.HEIGHT/Room.HEIGHT);

        if(right>=this.#cols)
        {
            right = this.#cols-1;
        }
        if(left<0)
        {
            left = 0;
        }
        if(top<0)
        {
            top = 0;
        }
        if(bottom>=this.#rows)
        {
            bottom = this.#rows-1;
        }

        // rows
        for(let y = top;y<=bottom;y++)
        {
            // columns
            for(let x = left;x<=right;x++)
            {
                const index = x+y*this.#cols;
                if(this.#rooms[index])
                {
                    this.#rooms[index].render(renderer);
                }
            }
        }
    }
    /**
     * 
     * @param {string[]} sources 
     */
    #createRooms(sources)
    {
        const cols = this.#cols;
        const rows = this.#rows;
        const scene = this.scene;

        let xx = Math.round(Math.random()*(cols-1));
        let yy = Math.round(Math.random()*(rows-1));

        let lastXx = xx;
        let lastYy = yy;

        const index = lastXx+lastYy*cols;

        const xp = lastXx*(Room.WIDTH*Tile.WIDTH)+this.x;
        const yp = lastYy*(Room.HEIGHT*Tile.HEIGHT)+this.y;

        this.#rooms[index] = new Room(scene, sources[Math.round(Math.random()*(sources.length-1))], xp, yp, {
            canSetPlayerPosition: true
        });

        for(let i = 0;i<this.#rooms.length;i++)
        {
            if(Math.random()<0.5&&yy>0)
            {
                yy--;
            }
            else if(Math.random()<0.5&&xx<cols-1)
            {
                xx++;
            }
            else if(Math.random()<0.5&&yy<rows-1)
            {
                yy++;
            }
            else if(Math.random()<0.5&&xx>0)
            {
                xx--;
            }

            const index = xx+yy*cols;

            const xp = xx*(Room.WIDTH*Tile.WIDTH)+this.x;
            const yp = yy*(Room.HEIGHT*Tile.HEIGHT)+this.y;

            // if already exists a room do not overlap
            if(!this.#rooms[index])
            {
                this.#rooms[index] = new Room(scene, sources[Math.round(Math.random()*(sources.length-1))], xp, yp, {
                    canSetPlayerPosition: false,
                    enemyRate: Math.random()*0.2
                });
            }

            // open space on the left side if needed
            if(lastXx<xx)
            {
                const prevIndex = lastXx+lastYy*cols;
                const y = Room.HEIGHT/2;
                const isFloat = y-Math.floor(y)!==0;
                for(let i = 0;i<(isFloat?1:2);i++)
                {
                    this.#rooms[prevIndex].setTile(Room.WIDTH-1, Math.floor(y)-i, Room.VOID_TILE_ID);
                    this.#rooms[index].setTile(0,  Math.floor(y)-i, Room.VOID_TILE_ID);
                }
            }
            // open space on the right side if needed
            else if(lastXx>xx)
            {
                const prevIndex = lastXx+lastYy*cols;
                const y = Room.HEIGHT/2;
                const isFloat = y-Math.floor(y)!==0;
                for(let i = 0;i<(isFloat?1:2);i++)
                {
                    this.#rooms[prevIndex].setTile(0, Math.floor(y)-i, Room.VOID_TILE_ID);
                    this.#rooms[index].setTile(Room.WIDTH-1,  Math.floor(y)-i, Room.VOID_TILE_ID);
                }
            }
            // open space on the top side if needed
            if(lastYy<yy)
            {
                const prevIndex = lastXx+lastYy*cols;
                const x = Room.WIDTH/2;
                const isFloat = x-Math.floor(x)!==0;
                for(let i = 0;i<(isFloat?1:2);i++)
                {
                    this.#rooms[prevIndex].setTile(Math.floor(x)-i, Room.HEIGHT-1, Room.VOID_TILE_ID);
                    this.#rooms[index].setTile(Math.floor(x)-i,  0, Room.VOID_TILE_ID);
                }
            }
            // open space on the bottom side if needed
            else if(lastYy>yy)
            {
                const prevIndex = lastXx+lastYy*cols;
                const x = Room.WIDTH/2;
                const isFloat = x-Math.floor(x)!==0;
                for(let i = 0;i<(isFloat?1:2);i++)
                {
                    this.#rooms[prevIndex].setTile(Math.floor(x)-i, 0, Room.VOID_TILE_ID);
                    this.#rooms[index].setTile(Math.floor(x)-i,  Room.HEIGHT-1, Room.VOID_TILE_ID);
                }
            }
            lastXx = xx;
            lastYy = yy;
        }
    }
    get rooms()
    {
        return this.#rooms;
    }
    /**
     * 
     * @param {string} path 
     * @returns {Promise}
     */
    static async getSources(path)
    {
        const res = await fetch(path);
        const data = (await res.text()).split("\r").join("");
        return data.split(World.#SOURCE_SEPARATOR);
    }

    static get SOURCE_SEPARATOR()
    {
        return World.#SOURCE_SEPARATOR;
    }
}