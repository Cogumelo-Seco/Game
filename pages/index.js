import data from '../public/js/data.js';
import createPage from '../public/js/Home/Home.js';
import render from '../public/js/Home/RenderScreen.js';
import { useRouter } from 'next/router';
import cookies from 'next-cookies';
import React, { useEffect } from 'react';
import Head from "next/head";

const Page = () => {    
    const cookie = cookies(data.cookies)
    const router = useRouter()

    useEffect(() => {
        if (cookie.animations == 'true') document.head.innerHTML += '<link rel="stylesheet" href="/css/home/animations.css" />'
        if (cookie.darkTheme == 'true') document.body.id = 'dark'

        const options = document.getElementById('options')
        const playGame = document.getElementById('playGame')
        const optionsButton = document.getElementById('optionsButton')
        const saveButton = document.getElementById('saveButton')
        const cancelButton = document.getElementById('cancelButton')

        const soundEffectsVolumeInput = document.getElementById('soundEffectsVolumeInput')
        const soundEffectsVolumePercent = document.getElementById('soundEffectsVolumePercent')
        const nickInput = document.getElementById('nickInput')
        const showInfos = document.getElementById('showInfosCheckbox')
        const fullScreen = document.getElementById('fullScreenCheckbox')
        const animations = document.getElementById('animationsCheckbox')
        const darkTheme = document.getElementById('darkThemeCheckbox')

        playGame.addEventListener('click', () => router.push('/servers'))
        optionsButton.addEventListener('click', () => {
            soundEffectsVolumeInput.value = cookie.soundEffectsVol || 100
            if (cookie.nick) nickInput.value = cookie.nick
            showInfos.checked = cookie.showInfos == 'true' ? true : false
            fullScreen.checked = cookie.fullScreen == 'true' ? true : false
            animations.checked = cookie.animations == 'true' ? true : false
            darkTheme.checked = cookie.darkTheme == 'true' ? true : false

            options.style.display = 'block'
        })

        saveButton.addEventListener('click', () => {
            cookie.soundEffectsVol = soundEffectsVolumeInput.value
            cookie.nick = nickInput.value
            cookie.showInfos = showInfos.checked.toString()
            cookie.fullScreen = fullScreen.checked.toString()
            cookie.animations = animations.checked.toString()
            cookie.darkTheme = darkTheme.checked.toString()

            document.cookie = `soundEffectsVol=${soundEffectsVolumeInput.value}; path=/`;
            document.cookie = `nick=${nickInput.value}; path=/`;
            document.cookie = `showInfos=${showInfos.checked}; path=/`;
            document.cookie = `fullScreen=${fullScreen.checked}; path=/`;
            document.cookie = `animations=${animations.checked}; path=/`;
            document.cookie = `darkTheme=${darkTheme.checked}; path=/`;

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
        
        render(canvas, page, cookie)
    }, [])

    return (
        <html lang="pt-BR">
            <Head>
                <title>Home</title>
            </Head>
            <head>                
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/css/home/home.css" />
                <link rel="stylesheet" href="/css/home/resizable.css" />
            </head>
            <body>
                <section>
                    <h1 id="gameName">100 Nome</h1>

                    <ul>
                        <li id="playGame">Servidores</li>
                        <li id="optionsButton">Opções</li>
                    </ul>

                    <div id="options">
                        <p id="nick">
                            Nick: <input id="nickInput" className="textInput" />
                        </p>
			<p id="soundEffectsVolume">
                            Volume dos efeitos: <input id="soundEffectsVolumeInput" type="range" /> <a id="soundEffectsVolumePercent">50%</a>
                        </p>
                        <p>
                            Mostrar Informações: <label className="switch">
                                <input type="checkbox" id="showInfosCheckbox" />
                                <span className="slider"></span>
                            </label>
                        </p>
                        <p>
                            Tela cheia <label className="switch">
                                <input type="checkbox" id="fullScreenCheckbox" />
                                <span className="slider"></span>
                            </label>
                        </p>
                        <p>
                            Animações: <label className="switch">
                                <input type="checkbox" id="animationsCheckbox" />
                                <span className="slider"></span>
                            </label>
                        </p>
                        <p>
                            Tema escuro: <label className="switch">
                                <input type="checkbox" id="darkThemeCheckbox" />
                                <span className="slider"></span>
                            </label>
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