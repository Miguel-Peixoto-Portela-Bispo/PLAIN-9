export default class Resizer{

    static resize(game)
    {
        if(window.innerWidth>innerHeight)
        {
            game.canvasElm.style.width = "auto";
            game.canvasElm.style.height = "95%";
        }
        else
        {
            game.canvasElm.style.width = "100%";
            game.canvasElm.style.height = "auto";
            let rect = game.canvasElm.getBoundingClientRect();
            while(rect.height>window.innerHeight)
            {
                rect = game.canvasElm.getBoundingClientRect();
                game.canvasElm.style.width = (rect.width-1)+"px";
                console.log()
            }
        }
    }
}