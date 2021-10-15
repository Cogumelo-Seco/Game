import data from '../public/js/data.js';
import createPage from '../public/js/Home/Home.js';
import render from '../public/js/Home/RenderScreen.js';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Head from "next/head";

const Page = () => {
    const router = useRouter()

    useEffect(() => {
        const options = document.getElementById('options')
        const playGame = document.getElementById('playGame')
        const optionsButton = document.getElementById('optionsButton')
        const saveButton = document.getElementById('saveButton')
        const cancelButton = document.getElementById('cancelButton')

        const soundEffectsVolumeInput = document.getElementById('soundEffectsVolumeInput')
        const soundEffectsVolumePercent = document.getElementById('soundEffectsVolumePercent')
        const nickInput = document.getElementById('nickInput')

        playGame.addEventListener('click', () => router.push('/servers'))
        optionsButton.addEventListener('click', () => {
            soundEffectsVolumeInput.value = data.soundEffectsVol
            nickInput.value = data.nick

            options.style.display = 'block'
        })

        saveButton.addEventListener('click', () => {
            data.soundEffectsVol = soundEffectsVolumeInput.value
            data.nick = nickInput.value

            options.style.display = 'none'
        })

        cancelButton.addEventListener('click', () => options.style.display = 'none')

        function loop() {
            if (soundEffectsVolumeInput.value > 0) soundEffectsVolumePercent.innerText = `${soundEffectsVolumeInput.value}%`
            else soundEffectsVolumePercent.innerText = `OFF`

            let rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

            rAF(() => {
                loop()
            })
        }
        loop()

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
                <title>Home</title>

                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/home/animations.css" />
                <link rel="stylesheet" href="/css/home/home.css" />
                <link rel="stylesheet" href="/css/home/resizable.css" />
            </Head>
            <body>
                <section>
                    <h1 id="gameName">100 Nome</h1>

                    <ul>
                        <li id="playGame">Servidores</li>
                        <li id="optionsButton">Opções</li>
                    </ul>

                    <div id="options">
                        <p id="nick">
                            Nick: <input id="nickInput" class="textInput" />
                        </p>
                        <p id="soundEffectsVolume">
                            Volume dos efeitos: <input id="soundEffectsVolumeInput" type="range" /> <a id="soundEffectsVolumePercent">50%</a>
                        </p>
                        <button id="saveButton">Salvar</button>
                        <button id="cancelButton">Cancelar</button>
                    </div>

                    <div id="ownerName">Power by: Cogumelo</div>
                </section>

                <canvas id="backgroundCanvas" />
            </body>
        </html>
    )
}

export default Page