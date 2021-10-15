import data from '../public/js/data.js';
import createGame from '../public/js/Game/Game.js';
import createListener from '../public/js/Game/Listener.js';
import PageFunctions from '../public/js/Game/PageFunctions/index.js';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Head from "next/head";

const Game = (props) => {
    const router = useRouter()

    useEffect(() => {
        const debug = false

        const canvas = document.getElementById('screen');
        let socket = null

        if (!debug) {
            if (!data.socket) return router.push('/servers')
            socket = data.socket;
            socket.emit('getSetup')
        } else {
            socket = io(props.SERVER, {
                withCredentials: true,
            })
            socket.emit('getSetup', true)
        }

        const game = createGame(data);
        const Listener = createListener();

        socket.on('deadPlayerGameOver', (command) => {
            if (command.playerId != socket.id) return;
            game.state.observedPlayerId = Object.keys(game.state.players)[0]
            alert(`Você Perdeu, seu score máximo foi ${command.score}`)            
        })
        socket.on('maxPlayers', () => {
            alert('Desculpe, mas o servidor está cheio')
            router.push('/servers')
        })
        socket.on('setup', (state) => {
            socket.emit('nick', data.nick)

            Listener.registerSettings({
                playerId: socket.id,
                serverId: state.serverId
            })
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
                    keyPressed: game.state.players[socket.id].direction,
                    serverId: game.state.serverId
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
        socket.on('deadPlayer', (command) => game.deadPlayer(command))
        socket.on('startGame', (command) => game.clientStart(command))
        socket.on('gameOver', (command) => {
            router.push('/')
            alert('O administrador saiu do servidor')
        })
        socket.on('move-player', (command) => {
            if (command.playerId != socket.id) game.movePlayer(command)
        });
        socket.on('song', (command) => {
            if (command.playerId == socket.id) game.playSoundEffect(command.song)
        });

        const startButton = document.getElementById('startButton')
        startButton.addEventListener('click', () => {
            startButton.style.display = 'none'
            socket.emit('startGame')
        })
        setTimeout(() => {
            socket.emit('startGame')
        }, 60000)
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Game</title>

                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                
                <link rel="stylesheet" href="/css/game/animations.css" />
                <link rel="stylesheet" href="/css/game/game.css" />
                <link rel="stylesheet" href="/css/game/resizable.css" />
            </Head>
            <body>
                <header id="header-screen">    
                    <div id="loadingCircle" />

                    <button id="chat-button" />
                    <div id="unreadMessageCounter" />

                    <canvas id="miniMap" />

                    <div id="chat">
                        <div id="chat-content" />
                        <input id="message-box" maxLength="140" placeholder="Enviar mensagem" />
                        <button id="send-button" title="Enviar mensagem" />
                    </div>

                    <table id="scoreTable" />
                    <button id="scoreTable-button" />
                    <div id="timer">00:00</div>

                    <div id="playerViewSelection">
                        <button className="observedPlayerSelectionArrows left" />                        
                        <button className="observedPlayerSelectionArrows right" />
                        <p id="nameOfSelectedPlayer" />
                        <p id="scoreOfSelectedPlayer" />
                    </div>

                    <div id="joystickContent">
                        <div id="joystick" />
                    </div>

                    <button id="startButton">Iniciar partida</button>

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
export async function getStaticProps() {
    const SERVER = process.env.SERVER

    return {
        props: {
            SERVER,
        },
        revalidate: 1800
    }
}

export default Game