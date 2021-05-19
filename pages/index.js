import createGame from '../public/Game.js';
import createListener from '../public/Listener.js';
import renderScreen from '../public/Render-Screen.js';
import io from 'socket.io-client';
import React, { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
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
        socket.on('setup', (state) => {
            let nick = prompt('Escolha seu nick')
            socket.emit('nick', nick || socket.id.substring(0, 10))

            Listener.registerPlayerId(socket.id)

            setInterval(() => {
                Listener.notifyAll({
                    type: 'move-player',
                    auto: true,
                    playerId: socket.id,
                    ping: +new Date(),
                    keyPressed: game.state.players[socket.id].direction
                })
            }, 2000)

            Listener.subscribe((command) => {
                socket.emit(command.type, command)
            });
            game.setState(state)
        })
        socket.on('add-player', (command) => {
            game.addPlayer(command)
        })
        socket.on('remove-fruit', (command) => {
            game.removeFruit(command)
        })
        socket.on('add-fruit', (command) => {
            game.addFruit(command)
        })
        socket.on('remove-player', (command) => {
            game.removePlayer(command)
        })
        socket.on('move-player', (command) => {
            game.movePlayer(command)
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
                    <a id="chat-content" />
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
            </body>
        </html>
    )
}

export default Page