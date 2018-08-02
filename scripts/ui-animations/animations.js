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
            let menu = document.querySelectorAll('.menubtn');
            let hideUI = document.querySelector('#hide-ui');
            let hideTools = document.querySelector('#hide-tools');
            let tools = document.querySelectorAll('.toolsbtn');
            let algorithms = document.querySelector('#select-algorithm');
            let algorithmText = document.getElementById('algorithm-text');
            let graphs = document.querySelector('#select-graph');
            let graphText = document.getElementById('graph-text');
            let delay = 0;
            let openTools = true;


            generateUI(hideUI,240,200,25,0);
            drawLine('alternate',1000);
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

            //Hide/Show UI menu
            hideUI.addEventListener('click', (function () {
                delay = 0;
                let text = document.getElementById("hide");
                if(text.innerHTML === "Hide UI") {
                    menu.forEach(function(element) {
                        generateUI(element,-225,0,0,delay);
                        delay = delay + 100;
                    });
                    text.innerHTML = "Show UI";
                    let lineDrawing = Anime({
                        targets: '#lineDrawing .lines path',
                        strokeDashoffset: [Anime.setDashoffset, 0],
                        easing: 'easeInOutSine',
                        duration: 1000,
                        direction: 'reverse',
                    });

                    tools.forEach(function (element) {
                        generateUI(element,240,200,25,delay);
                        delay = delay + 100;
                    });
                    openTools = false;

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
                    text.innerHTML = "Hide UI";
                    drawLine('alternate',1000);

                    tools.forEach(function (element) {
                        generateUI(element,-240,200,25,delay);
                        delay = delay + 100;
                    });
                    openTools = true;
                }
            }));

            graphs.addEventListener('click',function () {
                if(graphText.style.display !== 'none' && algorithmText.style.display !== 'none') {
                    enlargeOption(graphs,3,350,400,1000);
                    graphText.style.display = 'none';
                } else {
                    enlargeOption(graphs,1,200,0,200);
                    graphText.style.display = 'block';
                }
            });

            algorithms.addEventListener('click',function () {
                if(algorithmText.style.display !== 'none' && graphText.style.display !== 'none') {
                    enlargeOption(algorithms,3,250,325,1000);
                    document.getElementById('algorithm-text').style.display = 'none';
                } else {
                    enlargeOption(algorithms,1,200,0,200);
                    document.getElementById('algorithm-text').style.display = 'block';
                }
            });

            //ANIMATION FUNCTIONS
            function drawLine(direction,duration) {
                let lineDrawing = Anime({
                    targets: '#lineDrawing .lines path',
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

            let rotateLogo = Anime({
                targets: '#logo',
                rotate: '1turn',
                loop: true,
                duration: 5000,
                delay: 1000,
                easing: 'easeInOutSine'
            })
        }
    };
});