export default function renderScreen(canvas, page, cookie) {
    canvas.width = window.innerWidth/10;
    canvas.height = window.innerHeight/10;
    page.state.screen.width = canvas.width
    page.state.screen.height = canvas.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = cookie.darkTheme == 'true' ? '#363636' : '#CCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = cookie.darkTheme == 'true' ? 'rgb(170, 50, 50)' : '#f03434';
    ctx.fillRect(0, 0, canvas.width, 1)
    ctx.fillRect(0, canvas.height-1, canvas.width, 1)
    ctx.fillRect(0, 0, 1, canvas.height)
    ctx.fillRect(canvas.width-1, 0, 1, canvas.height)

    for (let botId in page.state.bots) {
        const bot = page.state.bots[botId]

        if (bot.x > canvas.width || bot.y > canvas.height) {
            bot.x = 5
            bot.y = 5
            bot.traces = [{ x: bot.x, y: bot.y}]
        }

        for (let i = 0; i < bot.traces.length; i++) {
            let trace = bot.traces[i]
            ctx.globalAlpha = 0.2
            ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
            ctx.fillRect(trace.x, trace.y, 1, 1);
            ctx.fillStyle = bot.color
            ctx.fillRect(trace.x, trace.y, 1, 1);
        }
        
        ctx.globalAlpha = 0.5
        ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
        ctx.fillRect(bot.x, bot.y, 1, 1);
        ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
        ctx.fillRect(bot.x, bot.y, 1, 1);
    }

    for (const fruitId in page.state.fruits) {
        const fruit = page.state.fruits[fruitId];
        if (fruit.x > canvas.width || fruit.y > canvas.height) delete page.state.fruits[fruitId]

        ctx.globalAlpha = 0.3
        ctx.fillStyle = cookie.darkTheme == 'true' ? 'white' : 'black';
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
        ctx.fillStyle = fruit.color || 'red';
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
    }

    let rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

    rAF(() => {
        renderScreen(canvas, page, cookie)
    })
}