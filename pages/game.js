import data from '../public/js/data.js';
import createGame from '../public/js/Game/Game.js';
import createListener from '../public/js/Game/Listener.js';
import PageFunctions from '../public/js/Game/PageFunctions/index.js';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Head from "next/head";

const Game = (props) => {    
    const cookie = cookies(data.cookies)
    const router = useRouter()

    useEffect(() => {
        let interval = setInterval(() => {
	        if (cookie.fullScreen == 'true') {
                document.documentElement.requestFullscreen()
  		            .then(() => clearInterval(interval))
                    .catch(() => console.log('Erro ao tentar deixar o jogo em tela cheia'))
            }
	    }, 1000)
        if (cookie.animations == 'true') document.head.innerHTML += '<link rel="stylesheet" href="/css/game/animations.css" />'        
        if (cookie.darkTheme == 'true') document.body.id = 'dark'

        const canvas = document.getElementById('screen');
        let socket = null

        if (!data.socket) return router.push('/servers')
        socket = data.socket;
        socket.emit('getSetup')

        const game = createGame(cookie);
        const Listener = createListener();

        document.getElementById('exitButton').addEventListener('click', () => {
            game.state.router = true
            router.push('/servers')
        })

        socket.on('deadPlayerGameOver', (command) => {
            if (command.playerId != socket.id) return;
            //game.state.observedPlayerId = command.player2Id || Object.keys(game.state.players)[0]
            game.state.gameAlert(`Você Perdeu, seu score máximo foi ${command.score}`)            
        })
        socket.on('maxPlayers', () => {
            game.state.gameAlert('Desculpe, mas o servidor está cheio')
            setTimeout(() => router.push('/servers'), 3000) 
        })
        socket.on('setup', (state) => {
            socket.emit('addMyPlayer', cookie.nick)

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
                if (game.state.noConnection <= 5) game.state.noConnection += 1
                else {
                    game.state.noConnection = -1000
                    game.state.gameAlert('Sem conexão com o servidor!')
                    setTimeout(() => router.push('/servers'), 3000)                    
                }
            }, 1000)
            PageFunctions(game, canvas, socket, Listener, cookie)
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
        socket.on('endOfTheGame', (command) => game.endOfTheGame(command, router))
        socket.on('message', (command) => game.message(command))
        socket.on('deadPlayer', (command) => game.deadPlayer(command))
        socket.on('startGame', (command) => {
            if (command.serverId == game.state.serverId) game.state.stopped = false
        })
        socket.on('newADM', (command) => {
            if (command.serverId == game.state.serverId) game.state.adm = command.admId
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
            socket.emit('startGame', { serverId: game.state.serverId })
        })
        setTimeout(() => {
            if (game.state.adm == game.state.myID) socket.emit('startGame', { serverId: game.state.serverId })
        }, 60000)
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Game</title>
            </Head>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                
                <link rel="stylesheet" href="/css/game/game.css" />
                <link rel="stylesheet" href="/css/game/resizable.css" />
            </head>
            <body id="body">
                <header id="header-screen">
                    <div id="loadingCircle" />

                    <div id="gameAlert" />

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

                    <div id="finalScreen">
                        <h1>Game Over</h1>
                        <p id="finalScreenP1" style={{ color: 'rgb(255, 196, 48)' }} />
                        <p id="finalScreenP2" style={{ color: 'gray' }} />
                        <p id="finalScreenP3" style={{ color: 'rgb(0, 229, 255)' }} />
                        <button id="exitButton">Sair</button>
                    </div>

                    <div id="playerScore">Score: ?</div>
                    <div id="playerCounter">?Players</div>
                    <div id="fruitCounter">?Frutas</div>
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