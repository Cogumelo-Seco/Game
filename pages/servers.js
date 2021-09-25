import createPage from '../public/js/Home/Home.js';
import render from '../public/js/Home/RenderScreen.js';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import React, { useEffect } from 'react';
import Head from "next/head";

const Page = (props) => {
    const router = useRouter()

    useEffect(() => {
        document.getElementById('returnButton').addEventListener('click', () => router.push('/'))

        const canvas = document.getElementById('backgroundCanvas')
        canvas.width = window.innerWidth/10;
        canvas.height = window.innerHeight/10;

        const page = createPage(canvas)

        setInterval(() => page.addFruit(), 2000)
        document.addEventListener('keydown', (event) => {
            if (event.key == '+' && Object.keys(page.state.bots).length < 50) page.addBot()
        })

        setTimeout(() => page.addBot(), 1000)
        
        render(canvas, page)

        const data = require('../public/js/data.js')
        
        const socket = io(props.SERVER, {
            withCredentials: true,
        })

        socket.emit('getServer', {
            type: 'list'
        })

        socket.on('serverList', (servers) => {
            let serverList = document.getElementById('serverList')
            let loadingCircle = document.getElementById('loadingCircle')
            serverList.innerHTML = ''
            for (let i in servers) {
                let server = document.createElement('div');
                server.id = 'server'
                server.innerHTML = `
                    <p id="Name">${i}</p>
                    <p id="PlayerCount">${servers[i].players}/${servers[i].maxPlayers}</p>
                `
                server.addEventListener('click', () => joinServer(i))
                serverList.appendChild(server)
            }
            if (loadingCircle) loadingCircle.style.display = 'none'
        })

        socket.on('server', () => {
            data.socket = socket
            router.push('/game')
        })

        function joinServer(serverName) {
            socket.emit('getServer', {
                type: 'server',
                server: serverName
            })
        }
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Servers</title>

                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/servers/animations.css" />
                <link rel="stylesheet" href="/css/servers/servers.css" />
                <link rel="stylesheet" href="/css/servers/resizable.css" />             
            </Head>
            <body>
                <section>
                    <div id="serverList">
                        <div id="loadingCircle" />
                    </div>

                    <button id="returnButton">Voltar</button>
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