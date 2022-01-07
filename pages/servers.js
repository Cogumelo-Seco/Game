import data from '../public/js/data.js';
import createPage from '../public/js/Home/Home.js';
import render from '../public/js/Home/RenderScreen.js';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import cookies from 'next-cookies';
import React, { useEffect } from 'react';
import Head from "next/head";

const Page = (props) => {
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
        if (cookie.animations == 'true') document.head.innerHTML += '<link rel="stylesheet" href="/css/servers/animations.css" />'
        if (cookie.darkTheme == 'true') document.body.id = 'dark'
        document.getElementById('returnButton').addEventListener('click', () => router.push('/'))

        const reloadButton = document.getElementById('reloadButton')
        const canvas = document.getElementById('backgroundCanvas')
        canvas.width = window.innerWidth/10;
        canvas.height = window.innerHeight/10;

        const page = createPage(canvas)

        setInterval(() => page.addFruit(), 2000)
        document.addEventListener('keydown', (event) => {
            if (event.key == '+' && Object.keys(page.state.bots).length < 50) page.addBot()
        })

        setTimeout(() => page.addBot(), 1000)
        
        render(canvas, page, cookie)
        
        if (data.socket) data.socket.emit('disconnectedPlayer')
        const socket = io(props.SERVER, {
            withCredentials: true,
        })

        reloadButton.addEventListener('click', () => socket.emit('getServer', {
            type: 'list'
        }))

        socket.emit('getServer', {
            type: 'list'
        })

        socket.on('serverList', listServers)
        socket.on('limitServers', () => alert('Desculpe, parece que não á espaço para mais servidores'))        

        socket.on('server', () => {
            data.socket = socket
            router.push('/game')
        })

        socket.on('serverDoesNotExist', () => socket.emit('getServer', {
                type: 'list'
        }))

        const serverCreationWindow = document.getElementById('serverCreationWindow')
        const botCount = document.querySelector('.serverCreationWindow-inputs.botCount')
        const gameSize = document.querySelector('.serverCreationWindow-inputs.gameSize')
        const maxPlayers = document.querySelector('.serverCreationWindow-inputs.maxPlayers')
        const Name = document.querySelector('.serverCreationWindow-inputs.Name')
        const gameTime = document.querySelector('.serverCreationWindow-inputs.gameTime')
        const fruitBirthSpeed = document.querySelector('.serverCreationWindow-inputs.fruitBirthSpeed')               
        
        document.getElementById('createButton').addEventListener('click', () => {
            socket.emit('createServer', {
                botCount: Number(botCount.value),
                gameSize: Number(gameSize.value),
                maxPlayers: Number(maxPlayers.value),
                Name: Name.value,
                gameTime: Number(gameTime.value),
                fruitBirthSpeed: Number(fruitBirthSpeed.value),
                adm: socket.id
            })
        })

        socket.on('connectToServers', (serverId) => joinServer(serverId))
        function joinServer(serverId) {
            socket.emit('getServer', {
                type: 'server',
                server: serverId
            })
        }

        function listServers(servers) {
            document.getElementById('serverCreationWindowButton').addEventListener('click', () => {
                if (serverCreationWindow.style.display == 'block') serverCreationWindow.style.display = 'none'
                else serverCreationWindow.style.display = 'block'
            })

            let serverList = document.getElementById('serverList')
            let loadingCircle = document.getElementById('loadingCircle')
            serverList.innerHTML = ''
            if (Object.keys(servers)[0]) {
                for (let i in servers) {
                    let server = document.createElement('div');
                    server.id = 'server'
                    server.innerHTML = `
                        <p id="Name">${servers[i].name}</p>
                        <p id="GameType">${servers[i].serverType || 'Normal'}</p>
                        <p id="Time">${servers[i].time/60000 >= 1 ? servers[i].time/60000+'m' : servers[i].time/1000-1+'s'}</p>
                        <p id="PlayerCount">${servers[i].players}/${servers[i].maxPlayers}</p>
                        <p id="GameSize">${servers[i].gameSize}X${servers[i].gameSize}</p>
                    `
                    if (servers[i].maxPlayers > servers[i].players) server.addEventListener('click', () => joinServer(i))
                    else {
                        server.style.borderColor = 'rgb(150, 50, 50)'
                        server.style.backgroundColor = 'rgba(255, 136, 136, 0.337)'
                    }
                    serverList.appendChild(server)
                }
            } else serverList.innerHTML = 'Sem servidores disponíveis!'
            if (loadingCircle) loadingCircle.style.display = 'none'
        }
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Servers</title>
            </Head>
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/servers/servers.css" />
                <link rel="stylesheet" href="/css/servers/resizable.css" />             
            </head>
            <body>
                <section>
                    <div id="serverList">
                        <div id="loadingCircle" />
                    </div>

                    <div id="serverCreationWindow">
                        <p className="serverCreationWindowMarginTop">Nome do servidor: <input className="serverCreationWindow-inputs Name" /></p>
                        <p>Tempo de jogo em minutos: <input className="serverCreationWindow-inputs gameTime" /> 1/20</p>
                        <p>Tamanho do jogo: <input className="serverCreationWindow-inputs gameSize" /> 100/500</p>
                        <p>Velocidade de spawn das frutas em segundos: <input className="serverCreationWindow-inputs fruitBirthSpeed" /> 0.1/1.5</p>
                        <p>Quantidade de Bots: <input className="serverCreationWindow-inputs botCount" /> 0/90</p>
                        <p>Quantidade Máxima de players: <input className="serverCreationWindow-inputs maxPlayers" /> 5/100</p>
                        <button id="createButton">Criar</button>
                    </div>
                    <div id="buttons">
                        <button id="returnButton" />
                        <button id="serverCreationWindowButton">Criar servidor</button>
                        <button id="reloadButton" />
                    </div>

                    <div id="ownerName">Power by: Cogumelo</div>
                </section>

                <canvas id="backgroundCanvas" /> 
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

export default Page