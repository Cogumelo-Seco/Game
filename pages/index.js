import createGame from '../public/Game.js';
import createListener from '../public/Listener.js';
import renderScreen from '../public/Render-Screen.js';
import io from 'socket.io-client';
import React, { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
        let song = new Audio('/songs/music.mp3');
        const musicButton = document.getElementById('music-button');
        musicButton.addEventListener('click', PlayStop);

        function PlayStop() {
            song.loop = true;
            if (song.played.length == 0 || song.paused) {
                musicButton.innerText = 'Música 🔊'
                song.play();
            } else {
                musicButton.innerText = 'Música 🔇'
                song.pause()
            }
        }

        const canvas = document.getElementById('screen');
        const pingDisplay = document.getElementById('pingDisplay');

        const socket = io('https://Game.cogumeloseco1.repl.co', {
            withCredentials: true,
        })

        const game = createGame();
        const Listener = createListener();

        socket.on('connect', () => {
            let playerId = socket.id
            game.state.myID = playerId
            renderScreen(canvas, game, pingDisplay, requestAnimationFrame);
            canvas.style.display = 'inline-block';
            document.getElementById('connecting').style.display = 'none';
            document.getElementById('timer').style.display = 'inline-block';
            pingDisplay.style.display = 'inherit';
            scoreTable.style.margin = '0px'
            console.log(`Player conectado ao servidor, ID: ${playerId}`)
        })
        socket.on('gameOver', (command) => {
            if (command.playerId != socket.id) return;
            alert(`Você Perdeu, seu score máximo foi ${command.score}`)
        })
        socket.on('setup', (state) => {
            let nick = prompt('Escolha seu nick')
            socket.emit('nick', nick || socket.id)

            Listener.registerPlayerId(socket.id)
            Listener.subscribe((command) => game.movePlayer(command));
            Listener.subscribe((command) => {
                socket.emit(command.type, command)
            });
            game.setState(state)

            setInterval(() => {
                if (game.state.players[socket.id]) Listener.notifyAll({
                    type: 'move-player',
                    auto: true,
                    playerId: socket.id,
                    keyPressed: game.state.players[socket.id].direction
                })
                socket.emit('ping', { ping: +new Date(), playerId: socket.id })
            }, 2000)
        })
        socket.on('ping', (command) => {
            game.ping(command)
        })
        socket.on('add-player', (command) => {
            game.addPlayer(command)
        })
        socket.on('remove-fruit', (command) => {
            game.removeFruit(command)

            if (command.playerId != socket.id) return;
            if (command.song == 'up') var song = new Audio('/songs/up.mp3');
            else var song = new Audio('/songs/up-100.mp3');
            song.play()
        })
        socket.on('add-fruit', (command) => {
            game.addFruit(command)
        })
        socket.on('remove-player', (command) => {
            game.removePlayer(command)
        })
        socket.on('move-player', (command) => {
            if (command.playerId != socket.id) game.movePlayer(command)
        })
        socket.on('change-player', (command) => {
            game.changePlayer(command)
        })
        socket.on('reset-game', (command) => {
            game.resetGame(command)
        })
        socket.on('message', (command) => {
            game.message(command)
        })
        socket.on('newTime', (time) => {
            game.state.time = time
        })
    }, [])

    return (
        <html lang="pt-BR">
            <head>
                
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="/socket.io/socket.io.js"></script>
                <title>Game</title>
            </head>
            <body>
                <button id="chat-button" />
                <h2 id="timer">00:00</h2>
                <h2 id="pingDisplay" title="Ping">?ms</h2>
                <p />
                <div id="chat">
                    <canvas id="chat-content" width="2000" height="4000" />
                    <p/>
                    <input id="message-box" maxLength="140" placeholder="Enviar mensagem" />
                    <button id="send-button" title="Enviar mensagem" />
                </div>

                <canvas id="screen" width="50" height="50" />

                <div id="scoreTable">
                    <a id="p1" title="Primeiro" />
                    <a id="p2" title="Segundo" />
                    <a id="p3" title="Terceiro" />
                    <a id="p4" />
                </div>
                
                <button className="arrows-buttons" id="arrow-up" />
                <p />
                <button className="arrows-buttons" id="arrow-left" />
                <button className="arrows-buttons" id="arrow-down" />
                <button className="arrows-buttons" id="arrow-right" />
                <h2 id="connecting">Conectando com o servidor...</h2>
                <p />
                <button id="music-button">Música 🔇</button>
            </body>
        </html>
    )
}

export default Page