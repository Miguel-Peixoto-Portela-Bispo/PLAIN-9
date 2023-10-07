import Resizer from "../util/resizer.js";
import Game from "./game.js";
import MainScene from "./scenes/main-scene.js";

const game = new Game();

game.inputs.addKey("ArrowUp");
game.inputs.addKey("ArrowRight");
game.inputs.addKey("ArrowDown");
game.inputs.addKey("ArrowLeft");

game.setScene("main", new MainScene(game));
game.enterScene("main");

Resizer.resize(game);

window.onresize = ()=>
{
    Resizer.resize(game);
}