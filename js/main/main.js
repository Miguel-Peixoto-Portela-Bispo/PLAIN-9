import Resizer from "../util/resizer.js";
import Game from "./game.js";
import MainScene from "./scenes/main-scene.js";
import TitleScene from "./scenes/title-scene.js";

const game = new Game();

initInputs();

game.setScene("title", new TitleScene(game));
game.setScene("main", new MainScene(game));

game.enterScene("title");

game.addChangeSceneTrigger("title", "main", ()=>game.getScene("title").startedPlay, ()=>game.setScene("main", new MainScene(game)));

Resizer.resize(game);

window.onresize = ()=>
{
    Resizer.resize(game);
}
function initInputs()
{
    game.inputs.addKey("ArrowUp");
    game.inputs.addKey("ArrowRight");
    game.inputs.addKey("ArrowDown");
    game.inputs.addKey("ArrowLeft");
    game.inputs.addKey("Space");
}