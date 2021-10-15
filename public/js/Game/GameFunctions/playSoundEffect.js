module.exports = (type, state, notifyAll, data) => {
    switch(type) {
        case 'kill':
            var song = new Audio('/songs/kill.mp3');
            song.volume = data.soundEffectsVol/100
            song.play()
            break
        case 'up+':
            var song = new Audio('/songs/up+.mp3');
            song.volume = data.soundEffectsVol/100
            song.play()
            break
        case 'up':
            var song = new Audio('/songs/up.mp3');
            song.volume = data.soundEffectsVol/100
            song.play()
            break
    }
}