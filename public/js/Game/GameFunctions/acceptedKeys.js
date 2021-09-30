module.exports = {
    w(player, state) {
        if (player.direction == 's') return false
        if (player.y <= 0) {
            player.direction = 'a'
            return false
        } else {
            player.y--
            player.direction = 'w'
            return true
        }
    },
    s(player, state) {
        if (player.direction == 'w') return false
        if (player.y >= state.screen.width-1) {
            player.direction = 'd';
            return false
        } else {
            player.y++
            player.direction = 's'
            return true
        }
    },
    a(player, state) {
        if (player.direction == 'd') return false
        if (player.x <= 0) {
            player.direction = 's';
            return false
        } else {
            player.x--
            player.direction = 'a'
            return true
        }
    },
    d(player, state) {
        if (player.direction == 'a') return false
        if (player.x >= state.screen.height-1) {
            player.direction = 'w';
            return false
        } else {
            player.x++
            player.direction = 'd'
            return true
        }
    }
}