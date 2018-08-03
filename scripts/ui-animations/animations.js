/**
 *  @author Ryan Marlow
 *  7/28/18
 *  animation.js
 * 
 *  Code for animation the UI
 */

'use strict';
define(['ui-animations/anime'], function(Anime)
{
    return {
        start()
        {
            //Sets specific buttons as variables, set default delay at 0.
            let menuOptions = document.querySelectorAll('.menuoptions');
            let menu = document.querySelectorAll('.menubtn');
            let hideUI = document.querySelector('#hide-ui');
            let hideTools = document.querySelector('#hide-tools');
            let tools = document.querySelectorAll('.toolsbtn');
            let delay = 0;
            let openTools = true;
            let showUI = true;

            tools.forEach(function (element) {
                generateUI(element,-235,200,25,delay);
                delay = delay + 50;
            });



            menu.forEach(function (element) {
                generateUI(element,200,200,50,delay);
                delay = delay + 100;
            });

            //Hide/Show tools menu
            hideTools.addEventListener('click',(function() {
                delay = 0;
                if(openTools) {
                    openTools = false;
                    tools.forEach(function (element) {
                        generateUI(element,240,200,25,delay);
                        delay = delay + 100;
                    });
                } else {
                    openTools = true;
                    tools.forEach(function (element) {
                        generateUI(element,-240,200,25,delay);
                        delay = delay + 100;
                    });
                }
            }));

            let createGraph = document.getElementsByClassName('creategraph');

            for(let i = 0; i<createGraph.length; i++) {
                createGraph[i].addEventListener('mouseenter',function () {
                    document.getElementById('creategraphbutton').style.stroke = "#ffcb48"
                });

                createGraph[i].addEventListener('mouseleave',function () {
                    document.getElementById('creategraphbutton').style.stroke = "#ff9a00"
                });
            }

            let selectGraph = document.getElementsByClassName('selectgraph');

            for(let i = 0; i<selectGraph.length; i++) {
                selectGraph[i].addEventListener('mouseenter',function () {
                    document.getElementById('selectgraphbutton').style.stroke = "#ffcb48"
                });

                selectGraph[i].addEventListener('mouseleave',function () {
                    document.getElementById('selectgraphbutton').style.stroke = "#ff9a00"
                });
            }

            let selectAlgorithm = document.getElementsByClassName('selectalgorithm');

            for(let i = 0; i<selectAlgorithm.length; i++) {
                selectAlgorithm[i].addEventListener('mouseenter',function () {
                    document.getElementById('selectalgorithmbutton').style.stroke = "#ffcb48"
                });

                selectAlgorithm[i].addEventListener('mouseleave',function () {
                    document.getElementById('selectalgorithmbutton').style.stroke = "#ff9a00"
                });
            }

            //Hide/Show UI menu
            hideUI.addEventListener('click', (function () {
                delay = 0;
                if(showUI) {
                    menu.forEach(function(element) {
                        generateUI(element,-225,0,0,delay);
                        delay = delay + 100;
                    });

                    tools.forEach(function (element) {
                        generateUI(element,240,200,25,delay);
                        delay = delay + 100;
                    });
                    openTools = false;
                    showUI = false;

                    if(graphText.style.display = 'none') {
                        graphText.style.display = 'block';
                    }

                    if(algorithmText.style.display = 'none') {
                        algorithmText.style.display = 'block';
                    }
                } else {
                    delay = 0;
                    menu.forEach(function(element) {
                        generateUI(element,200,200,50,delay);
                        delay = delay + 100;
                    });

                    tools.forEach(function (element) {
                        generateUI(element,-240,200,25,delay);
                        delay = delay + 100;
                    });
                    openTools = true;
                    showUI = true;
                }
            }));

            //ANIMATION FUNCTIONS
            function drawLine(target,direction,duration) {
                let lineDrawing = Anime({
                    targets: target,
                    strokeDashoffset: [Anime.setDashoffset, 0],
                    easing: 'easeInOutSine',
                    duration: duration,
                    delay: function(el, i) { return i * 250 },
                    direction: direction,
                    loop: false
                });
            }

            function generateUI(component,direction,width,height,delay) {
                let enterUI = Anime ({
                    targets: component,
                    width: width,
                    height: height,
                    translateX: direction,
                    easing: 'easeInOutExpo',
                    delay: delay
                })
            }

            function enlargeOption(target, scale, moveX, moveY, width) {
                let enlarge = Anime({
                    translateX: moveX,
                    translateY: moveY,
                    targets: target,
                    width: width,
                    duration: 250,
                    scale: scale,
                    loop: false,
                    easing: 'easeInOutQuart'
                });
            }

            let rotateOuter = Anime({
                targets: '#outer',
                rotate: '1turn',
                loop: true,
                duration: 10000,
                easing: 'linear'
            });

            let rotateMenu = Anime({
                targets: '#inner',
                rotate: '1turn',
                loop: true,
                duration: 15000,
                direction: 'reverse',
                easing: 'linear'
            });
        }
    };
});