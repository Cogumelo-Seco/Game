import createGame from '../public/Game.js';
import createKeyboardListener from '../public/Keyboard-Listener.js';
import renderScreen from '../public/Render-Screen.js';
import io from 'socket.io-client';
import React, { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
        const canvas = document.getElementById('screen');
        const scoreTable = document.getElementById('scoreTable');
        const pingDisplay = document.getElementById('pingDisplay');

        const socket = io('https://Game.cogumeloseco1.repl.co', {
            withCredentials: true,
        })

        const game = createGame();
        const keyboardListener = createKeyboardListener();

        socket.on('connect', () => {
            let playerId = socket.id
            renderScreen(canvas, game, scoreTable, pingDisplay, requestAnimationFrame, playerId);
            canvas.style.display = "inline-block"
            pingDisplay.style.display = "inherit"
            console.log(`Player conectado ao servidor, ID: ${playerId}`)
        })
        socket.on('setup', (state) => {
            let nick = prompt('Escolha seu nick')
            socket.emit('nick', nick || socket.id)

            keyboardListener.registerPlayerId(socket.id)
            keyboardListener.subscribe(game.movePlayer);
            keyboardListener.subscribe((command) => {
                socket.emit(command.type, command)
            });
            game.setState(state)
        })
        socket.on('add-player', (command) => {
            game.addPlayer(command)
            /*setInterval(() => {
                if (game.state.players[socket.id].direction == 'w') var  keyPressed = 'w'
                if (game.state.players[socket.id].direction == 's') var  keyPressed = 's'
                if (game.state.players[socket.id].direction == 'a') var  keyPressed = 'a'
                if (game.state.players[socket.id].direction == 'd') var  keyPressed = 'd'
                const command = {
                    type: 'move-player',
                    playerId: socket.id,
                    ping: +new Date(),
                    keyPressed
                }
                keyboardListener.notifyAll(command)
            }, 2000)*/
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
            const playerId = socket.id

            if (playerId != command.playerId) {
                game.movePlayer(command)
            }
        })
        socket.on('change-player', (command) => {
            game.changePlayer(command)
        })
        socket.on('clear-fruits', (command) => {
            game.clearFruits(command)
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
                <h2 id="pingDisplay">?ms</h2>
                <canvas id="screen" width="50" height="50"></canvas>
                <button id="arrow-up" />
                <p />
                <button id="arrow-left" />
                <button id="arrow-down" />
                <button id="arrow-right" />
                <h2 id="scoreTable">Conectando com o servidor...</h2>
            </body>
        </html>
    )
}

export default Page