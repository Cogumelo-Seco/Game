import createGame from '../public/Game/Game.js';
import createListener from '../public/Game/Listener.js';
import PageFunctions from '../public/Game/PageFunctions/index.js';
import io from 'socket.io-client';
import React, { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
        //let song = new Audio('/songs/music.mp3');
        /*const musicButton = document.getElementById('music-button');
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
        }*/

        const canvas = document.getElementById('screen');

        const socket = io('https://Game.cogumeloseco1.repl.co', {
            withCredentials: true,
        })

        const game = createGame(socket);
        const Listener = createListener();

        socket.on('connect', () => {
            
        })
        socket.on('gameOver', (command) => {
            if (command.playerId != socket.id) return;
            game.dead = true;
            game.state.myID = Object.keys(game.state.players)[0]
            alert(`Você Perdeu, seu score máximo foi ${command.score}`)            
        })
        socket.on('setup', (state) => {
            let nick = prompt('Escolha seu nick')
            socket.emit('nick', nick)

            Listener.registerPlayerId(socket.id)
            Listener.subscribe((command) => game.movePlayer(command));
            Listener.subscribe((command) => {
                socket.emit(command.type, command)
            });
            game.subscribe((command) => {
                socket.emit(command.type, command)
            });
            state.time = +new Date()+state.time
            game.setState(state)

            setInterval(() => {
                if (game.state.players[socket.id]) Listener.notifyAll({
                    type: 'move-player',
                    auto: true,
                    playerId: socket.id,
                    keyPressed: game.state.players[socket.id].direction
                })
                socket.emit('ping', { ping: +new Date(), playerId: game.state.myID || socket.id })
            }, 1000)
            PageFunctions(game, canvas, socket, Listener)
        })
        socket.on('ping', (command) => game.ping(command))
        socket.on('newTime', (time) => game.state.time = +new Date()+time)
        socket.on('add-player', (command) => game.addPlayer(command))
        socket.on('add-bot', (command) => game.addBot(command))
        socket.on('remove-fruit', (command) => game.removeFruit(command))
        socket.on('add-fruit', (command) => game.addFruit(command))
        socket.on('remove-player', (command) => game.removePlayer(command))        
        socket.on('move-bot', (command) => game.moveBot(command))
        socket.on('change-player', (command) => game.changePlayer(command))
        socket.on('reset-game', (command) => game.resetGame(command))
        socket.on('message', (command) => game.message(command))
        socket.on('revalidatePlayer', (command) => game.revalidatePlayer(command))           
        socket.on('move-player', (command) => {
            if (command.playerId != socket.id) game.movePlayer(command)
        });
        socket.on('song', (command) => {
            if (command.playerId != socket.id) return;
            if (command.song == 'kill') var song = new Audio('/songs/kill.mp3');
            song?.play()
        });
    }, [])

    return (
        <html lang="pt-BR">
            <head>
            <title>Game</title>

                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/game/animations.css" />
                <link rel="stylesheet" href="/css/game/game.css" />                
            </head>
            <body>
                <header id="header-screen">
                    <button id="chat-button" />

                    <div id="chat">
                        <div id="chat-content" />
                        <input id="message-box" maxLength="140" placeholder="Enviar mensagem" />
                        <button id="send-button" title="Enviar mensagem" />
                    </div>

                    <table id="scoreTable" />
                    <div id="timer">00:00</div>

                    <div id="playerViewSelection">
                        <button className="observedPlayerSelectionArrows left" />                        
                        <button className="observedPlayerSelectionArrows right" />
                        <p id="nameOfSelectedPlayer" />
                        <p id="scoreOfSelectedPlayer" />
                    </div>

                    <div id="playerScore">Score: ?</div>
                    <div id="fpsDisplay">?FPS</div>
                    <div id="pingDisplay">?ms</div>
                </header>

                <section>
                    <canvas id="screen" />
                </section>
                
            </body>
        </html>
    )
}
/*
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
                <button id="music-button">Música 🔇</button>*/
export default Page