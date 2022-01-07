module.exports = (type, state, notifyAll, cookie) => {
    let vol = Number(cookie.soundEffectsVol)/100
    let songDir = null

    console.log(cookie)

    switch(type) {
        case 'kill':
            songDir = '/songs/kill.mp3'
            break
        case 'up+':
            songDir = '/songs/up+.mp3'
            break
        case 'up':
            songDir = '/songs/up.mp3'
            break
    }

    if (songDir) {
        const song = new Audio(songDir);
        song.volume = vol
        song.play()
    }
}