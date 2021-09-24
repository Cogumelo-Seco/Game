import createPage from '../public/js/Home/Home.js';
import render from '../public/js/Home/RenderScreen.js';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Head from "next/head";

const Page = () => {
    const router = useRouter()

    useEffect(() => {
        document.getElementById('playGame').addEventListener('click', () => router.push('/game'))

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
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Game</title>

                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/home/animations.css" />
                <link rel="stylesheet" href="/css/home/home.css" />                
            </Head>
            <body>
                <section>
                    <h1 id="gameName">100 Nome</h1>

                    <ul>
                        <li id="playGame">Jogar</li>
                        <li>Opções</li>
                    </ul>

                    <div id="ownerName">Power by: Cogumelo</div>
                </section>

                <canvas id="backgroundCanvas" />             
            </body>
        </html>
    )
}

export default Page