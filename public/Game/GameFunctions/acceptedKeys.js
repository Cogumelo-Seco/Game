module.exports = {
    w(player, state) {
        if (player.traces.find((t) => t.x == player.x && t.y == player.y-1 && player.direction == 's')) return;
        if (player.y <= 0) return player.direction = 'a';
        else player.y--
        player.direction = 'w'
        player.traces.push({ x: player.x, y: player.y })
    },
    s(player, state) {
        if (player.traces.find((t) => t.x == player.x && t.y == player.y+1 && player.direction == 'w')) return;
        if (player.y >= state.screen.width-1) return player.direction = 'd';
        else player.y++
        player.direction = 's'
        player.traces.push({ x: player.x, y: player.y })
    },
    a(player, state) {
        if (player.traces.find((t) => t.x == player.x-1 && t.y == player.y && player.direction == 'd')) return;
        if (player.x <= 0) return player.direction = 's';
        else player.x--
        player.direction = 'a'
        player.traces.push({ x: player.x, y: player.y })
    },
    d(player, state) {
        if (player.traces.find((t) => t.x == player.x+1 && t.y == player.y && player.direction == 'a')) return;
        if (player.x >= state.screen.height-1) return player.direction = 'w';
        else player.x++
        player.direction = 'd'
        player.traces.push({ x: player.x, y: player.y })
    }
}