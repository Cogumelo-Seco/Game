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
                    if (direction == 's') direction = generateRandomDirection('w')
                    else direction = 'w'
                } else {
                    if (direction == 'w') direction = generateRandomDirection('s')
                    else direction = 's'
                }
                break
            }
            if (fruit.y == bot.y) {
                if (fruit.x <= bot.x) {
                    if (direction == 'd') direction = generateRandomDirection('a')
                    else direction = 'a'
                } else {
                    if (direction == 'a') direction = generateRandomDirection('d')
                    else direction = 'd'
                }
                break
            }
        }

        let acceptedKeys = {
            w(bot, state) {
                if (bot.direction == 's') return false
                if (bot.y <= 1) {
                    bot.direction = 'a'
                    return false
                }
                bot.y--
                bot.direction = 'w'
                return true
            },
            s(bot, state) {
                if (bot.direction == 'w') return false
                if (bot.y >= state.screen.width-2) {
                    bot.direction = 'd';
                    return false
                } 
                bot.y++
                bot.direction = 's'
                return true
            },
            a(bot, state) {
                if (bot.direction == 'd') return false
                if (bot.x <= 1) {
                    bot.direction = 's';
                    return false
                }
                bot.x--
                bot.direction = 'a'
                return true
            },
            d(bot, state) {
                if (bot.direction == 'a') return false
                if (bot.x >= state.screen.height-2) {
                    bot.direction = 'w';
                    return false
                }
                bot.x++
                bot.direction = 'd'
                return true
            }
        }

        const moveFunction = acceptedKeys[direction]

        if (moveFunction) {
            let move = moveFunction(bot, state)
            if (move) bot.traces.unshift({ x: bot.x, y: bot.y })
        }

        if (bot.traces.length-1 > bot.score || bot.traces.length >= 1000) bot.traces.splice(bot.traces.length-1, 1)

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (bot.x == fruit.x && bot.y == fruit.y) {
                bot.score++
                delete state.fruits[fruitId]
            }
        }
    }, 200)
}