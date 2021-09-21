module.exports = ([ bot, botId, game ], state, notifyAll) => {
	const acceptedKeys = require('./acceptedKeys')

	let direction = bot.direction

	let percent = Math.floor(Math.random() * 100)
	if (percent <= 50) {
		let acceptedMoves = [ 'w', 'a', 's', 'd' ]
		direction = acceptedMoves[Math.floor(Math.random() * acceptedMoves.length)]
	}

	for (const fruitId in game.state.fruits) {
		const fruit = game.state.fruits[fruitId]
		if (fruit.x == bot.x) {
			if (fruit.y <= bot.y) {
				if (bot.traces.find((t) => t.x == bot.x && t.y == bot.y-1)) direction = 'a'
				else direction = 'w'
			} else {
				if (bot.traces.find((t) => t.x == bot.x && t.y == bot.y+1)) direction = 'd'
				else direction = 's'
			}
			break
		}
		if (fruit.y == bot.y) {
			if (fruit.x <= bot.x) {
				if (bot.traces.find((t) => t.x == bot.x-1 && t.y == bot.y)) direction = 'w'
				else direction = 'a'
			} else {
				if (bot.traces.find((t) => t.x == bot.x+1 && t.y == bot.y)) direction = 's'
				else direction = 'd'
			}
			break
		}
	}

	for (const fruitId in game.state.fruits) {
		const fruit = game.state.fruits[fruitId]
		let up1 = false;
		if (bot.x == fruit.x && bot.y == fruit.y) {
			bot.score++
			if (bot.score%50 == 0) up1 = true;
			game.removeFruit({ 
				playerId: botId,
				up1,
				fruitId
			})
		}
	}

	return direction
}