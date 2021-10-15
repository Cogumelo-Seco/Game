module.exports = (type, state, notifyAll, data) => {
    const vol = Number(data.soundEffectsVol)/100
    let songDir = null

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