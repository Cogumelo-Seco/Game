export default function renderScreen(canvas, page) {
    canvas.width = window.innerWidth/10;
    canvas.height = window.innerHeight/10;
    page.state.screen.width = window.innerWidth/10;
    page.state.screen.height = window.innerHeight/10;
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#f03434'
    ctx.fillRect(0, 0, canvas.width, 1)
    ctx.fillRect(0, canvas.height-1, canvas.width, 1)
    ctx.fillRect(0, 0, 1, canvas.height)
    ctx.fillRect(canvas.width-1, 0, 1, canvas.height)

    for (let botId in page.state.bots) {
        const bot = page.state.bots[botId]

        if (bot.x > canvas.width || bot.y > canvas.height) {
            bot.x = 5
            bot.y = 5
        }

        ctx.fillStyle = '#363636'

        for (let i = 0; i < bot.traces.length; i++) {
            let trace = bot.traces[i]
            ctx.globalAlpha = 0.5
            ctx.fillRect(trace.x, trace.y, 1, 1);
        }

        ctx.globalAlpha = 1
        ctx.fillRect(bot.x, bot.y, 1, 1);
    }

    for (const fruitId in page.state.fruits) {
        const fruit = page.state.fruits[fruitId];
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.5
        ctx.fillRect(fruit.x, fruit.y, 1, 1);
    }

    let rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

    rAF(() => {
        renderScreen(canvas, page)
    })
}