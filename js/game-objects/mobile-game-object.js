import StringMask from "../util/string-mask.js";
import Vector from "../util/vector.js";
import Room from "../world/room.js";
import Tile from "../world/tile.js";
import GameObject from "./game-object.js";

export default class MobileGameObject extends GameObject{

    /**
     * 
     * @param {Room[]} rooms
     */
    update(rooms){}
    /**
     * 
     * @param {Vector} vel 
     * @param {Room[]} rooms
     */
    move(vel, rooms)
    {
        if(vel.x&&vel.y)
        {
            this.move(new Vector(vel.x, 0), rooms);
            this.move(new Vector(0, vel.y), rooms);
            return;
        }
        else
        {
            const lastPos = this.position;
            const lastMaskPos = this.mask.position;

            this.position = this.position.add(vel);
            this.mask.position = this.mask.position.add(vel);

            if(rooms)
            {
                const tiles = this._getCollidedTiles(rooms)
                for(let i = 0;i<tiles.length;i++)
                {
                    if(tiles[i].isSolid)
                    {
                        this.position = lastPos;
                        this.mask.position = lastMaskPos;
                        break;
                    }
                }
            }
        }
    }
    /**
     * 
     * @param {Room[]} rooms
     */
    _getCollidedTiles(rooms)
    {
        let result = [];
        
        const points = StringMask.getPoints(this.text);

        for(const room of rooms)
        {
            if(room)
            for(let i = 0;i<points.length;i++)
            {
                const xp = Math.round(points[i].x+this.position.x)/Tile.WIDTH;
                const yp = Math.round(points[i].y+this.position.y)/Tile.HEIGHT;

                result.push(room.getTile(Math.floor(xp), Math.floor(yp)));
            }
        }

        return result;
    }
}