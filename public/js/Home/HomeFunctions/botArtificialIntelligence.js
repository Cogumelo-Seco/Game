module.exports = (command, state) => {
    const bot = command.bot

    setInterval(() => {
        function generateRandomDirection(blocked) {
            let acceptedMoves = [ 'w', 'a', 's', 'd' ]
            if (blocked) acceptedMoves.splice(acceptedMoves.indexOf(blocked), 1)
            return acceptedMoves[Math.floor(Math.random() * acceptedMoves.length)]
        }

        let direction = bot.direction

        let percent = Math.floor(Math.random() * 100)
        if (percent <= 50) direction = generateRandomDirection()

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (fruit.x == bot.x) {
                if (fruit.y <= bot.y) {
                    if (bot.traces.find((t) => t.x == bot.x && t.y == bot.y-1)) direction = generateRandomDirection('w')
                    else direction = 'w'
                } else {
                    if (bot.traces.find((t) => t.x == bot.x && t.y == bot.y+1)) direction = generateRandomDirection('s')
                    else direction = 's'
                }
                break
            }
            if (fruit.y == bot.y) {
                if (fruit.x <= bot.x) {
                    if (bot.traces.find((t) => t.x == bot.x-1 && t.y == bot.y)) direction = generateRandomDirection('a')
                    else direction = 'a'
                } else {
                    if (bot.traces.find((t) => t.x == bot.x+1 && t.y == bot.y)) direction = generateRandomDirection('d')
                    else direction = 'd'
                }
                break
            }
        }

        switch(direction) {
            case 'w':
                if (bot.y <= 1) return bot.direction = 'a';
                else bot.y--
                bot.direction = 'w'
                break
            case 'a':
                if (bot.x <= 1) return bot.direction = 's';
                else bot.x--
                bot.direction = 'a'
                break
            case 's':
                if (bot.y >= state.screen.height-2) return bot.direction = 'd';
                else bot.y++
                bot.direction = 's'
                break
            case 'd':
                if (bot.x >= state.screen.width-2) return bot.direction = 'w';
                else bot.x++
                bot.direction = 'd'
                break
        }
        
        bot.traces.push({ x: bot.x, y: bot.y })
        if (bot.traces.length > bot.score) bot.traces.splice(0, 1)

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (bot.x == fruit.x && bot.y == fruit.y) {
                bot.score++
                delete state.fruits[fruitId]
            }
        }
    }, 500)
}