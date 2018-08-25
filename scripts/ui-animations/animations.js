/**
 *  @author Ryan Marlow
 *  7/28/18
 *  animation.js
 * 
 *  Code for animation the UI
 */

'use strict';
define(['ui-animations/anime','utils/Util'], function(Anime,Util)
{
    return {
        start()
        {
            //Sets specific buttons as variables, set default delay at 0.
            let xpos;
            let ypos;
            let menuOptions = document.querySelectorAll('.menuoptions');
            let menu = document.querySelectorAll('.menubtn');
            let delay = 0;
            let openTools = true;
            let showUI = true;
            let eduModeStyle = false;
            let lightOrange = "#ffcb48";
            let darkOrange = "#ff9a00";
            let lightGray = "#9d9b98";
            let darkGray = "#262626";
            let white = "#fff";

            menu.forEach(function (element) {
                generateUI(element,200,200,50,delay);
                delay = delay + 100;
            });

            //Hide/Show tools menu
            let createGraph = document.getElementsByClassName('creategraph');
            for(let i = 0; i<createGraph.length; i++) {
                createGraph[i].addEventListener('mouseenter',function () {
                    document.getElementById('creategraphbutton').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                createGraph[i].addEventListener('mouseleave',function () {
                    document.getElementById('creategraphbutton').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let selectGraph = document.getElementsByClassName('selectgraph');
            for(let i = 0; i<selectGraph.length; i++) {
                selectGraph[i].addEventListener('mouseenter',function () {
                    document.getElementById('selectgraphbutton').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                selectGraph[i].addEventListener('mouseleave',function () {
                    document.getElementById('selectgraphbutton').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let eduMode = document.getElementsByClassName('eduMode');


            for(let i = 0; i<eduMode.length; i++) {
                eduMode[i].addEventListener('click',function () {
                    swapStyleSheet('graphedu.css');
                });

                eduMode[i].addEventListener('mouseenter',function () {
                    document.getElementById('eduModeButton').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                eduMode[i].addEventListener('mouseleave',function () {
                    document.getElementById('eduModeButton').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }


            //Tool Menu Highlights
            let addVertex = document.getElementsByClassName('addVertexButton');
            for(let i = 0; i<addVertex.length; i++) {
                addVertex[i].addEventListener('mouseenter',function () {
                    document.getElementById('add-vertex').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                addVertex[i].addEventListener('mouseleave',function () {
                    document.getElementById('add-vertex').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let addEdge = document.getElementsByClassName('addEdgeButton');
            for(let i = 0; i<addEdge.length; i++) {
                addEdge[i].addEventListener('mouseenter',function () {
                    document.getElementById('add-edge').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                addEdge[i].addEventListener('mouseleave',function () {
                    document.getElementById('add-edge').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let addWeight = document.getElementsByClassName('addWeightButton');
            for(let i = 0; i<addWeight.length; i++) {
                addWeight[i].addEventListener('mouseenter',function () {
                    document.getElementById('edit-edge').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                addWeight[i].addEventListener('mouseleave',function () {
                    document.getElementById('edit-edge').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let undo = document.getElementsByClassName('undoButton');
            for(let i = 0; i<undo.length; i++) {
                undo[i].addEventListener('mouseenter',function () {
                    document.getElementById('undo').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                undo[i].addEventListener('mouseleave',function () {
                    document.getElementById('undo').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            let redo = document.getElementsByClassName('redoButton');
            for(let i = 0; i<redo.length; i++) {
                redo[i].addEventListener('mouseenter',function () {
                    document.getElementById('redo').style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                });

                redo[i].addEventListener('mouseleave',function () {
                    document.getElementById('redo').style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                });
            }

            function findDocumentCoords(mouseEvent)
            {
                if (mouseEvent)
                {
                    //FireFox
                    xpos = mouseEvent.pageX;
                    ypos = mouseEvent.pageY;
                }
                else
                {
                    //IE
                    xpos = window.event.x + document.body.scrollLeft - 2;
                    ypos = window.event.y + document.body.scrollTop - 2;
                }
            }

            document.onmousemove = findDocumentCoords;


            window.addEventListener('keydown', Util.throttle(function(e)
            {
                let key = e.keyCode ? e.keyCode : e.which;
                let toolButtons = document.querySelector("#toolbuttons");
                let toolText = document.querySelectorAll(".toolText");

                if (key === 17 && openTools) {
                    openTools = false;
                    toolButtons.style.scale = .5;
                    toolButtons.style.left = xpos - 150;
                    toolButtons.style.top = ypos - 150;

                    toolButtons.style.display = 'block';

                    toolText.forEach(function(text) {
                        text.style.display = 'none';
                    });

                    let rotateMenu = Anime({
                        targets: '#toolbuttons',
                        rotate: '-90',
                        duration: 250,
                        direction: 'reverse',
                        easing: 'linear'
                    });

                    expandTools("#createModeButton",0,-95);
                    expandTools("#deleteModeButton",105,-20);
                    expandTools("#extraModeButton",-105,-20);
                    expandTools("#undoModeButton",-50,90);
                    expandTools("#redoModeButton",50,90);

                    setTimeout(function () {
                        openTools = true;
                        toolText.forEach(function(text) {
                            text.style.display = 'block';
                        });
                    }, 200);
                }
            }, 500));


            window.addEventListener('keyup', Util.throttle(function(e)
            {
                let key = e.keyCode ? e.keyCode : e.which;
                let toolButtons = document.querySelector("#toolbuttons");
                let toolText = document.querySelectorAll(".toolText");

                if (key === 17 && openTools) {
                    openTools = false;
                    toolText.forEach(function (text) {
                        text.style.display = 'none';
                    });

                    let rotateMenu = Anime({
                        targets: '#toolbuttons',
                        rotate: '0',
                        direction: 'normal',
                        easing: 'linear'
                    });

                    expandTools("#createModeButton",0,0);
                    expandTools("#deleteModeButton",0,0);
                    expandTools("#extraModeButton",0,0);
                    expandTools("#undoModeButton",0,0);
                    expandTools("#redoModeButton",0,0);
                    setTimeout(function () {
                        toolButtons.style.display = 'none';
                        openTools = true;
                    }, 200);
                }
            }, 500));

            //ANIMATION FUNCTIONS
            function drawLine(target,direction,duration) {
                let lineDrawing = Anime({
                    targets: target,
                    strokeDashoffset: [Anime.setDashoffset, 0],
                    easing: 'easeInOutSine',
                    duration: duration,
                    delay: function(el, i) { return i * 250 },
                    direction: direction,
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

            function expandTools(target, moveX, moveY) {
                let expandTool = Anime({
                    targets: target,
                    translateX: moveX,
                    translateY: moveY,
                    easing: 'easeInOutQuart',
                    duration: 250
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

            //StyleSheet Switch

            function swapStyleSheet() {
                let ui = document.getElementsByClassName('ui');

                if(eduModeStyle) {
                    document.getElementById('pagestyle').setAttribute('href', 'css/graphvis.css');
                    for(let i = 0; i<ui.length; i++) {
                        ui[i].style.stroke = darkOrange;
                    }
                    //.engine.config.backgroundColor = '#262626';
                    eduModeStyle = false;
                } else {
                    document.getElementById('pagestyle').setAttribute('href', 'css/graphedu.css');
                    for(let i = 0; i<ui.length; i++) {
                        ui[i].style.stroke = darkGray;
                    }
                    eduModeStyle = true;
                }
            }

        }, swapColors(graph) {
                graph.view.engine.config.backgroundColor = '#fff';
        }
    };
});