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
            let openTools = false;
            let showUI = true;


            menu.forEach(function (element) {
                generateUI(element,200,200,50,delay);
                delay = delay + 100;
            });

            //Hide/Show tools menu
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


            //Tool Menu Highlights
            let addVertex = document.getElementsByClassName('addVertexButton');
            for(let i = 0; i<addVertex.length; i++) {
                addVertex[i].addEventListener('mouseenter',function () {
                    document.getElementById('add-vertex').style.stroke = "#ffcb48"
                });

                addVertex[i].addEventListener('mouseleave',function () {
                    document.getElementById('add-vertex').style.stroke = "#ff9a00"
                });
            }

            let addEdge = document.getElementsByClassName('addEdgeButton');
            for(let i = 0; i<addEdge.length; i++) {
                addEdge[i].addEventListener('mouseenter',function () {
                    document.getElementById('add-edge').style.stroke = "#ffcb48"
                });

                addEdge[i].addEventListener('mouseleave',function () {
                    document.getElementById('add-edge').style.stroke = "#ff9a00"
                });
            }

            let addWeight = document.getElementsByClassName('addWeightButton');
            for(let i = 0; i<addWeight.length; i++) {
                addWeight[i].addEventListener('mouseenter',function () {
                    document.getElementById('edit-edge').style.stroke = "#ffcb48"
                });

                addWeight[i].addEventListener('mouseleave',function () {
                    document.getElementById('edit-edge').style.stroke = "#ff9a00"
                });
            }

            let undo = document.getElementsByClassName('undoButton');
            for(let i = 0; i<undo.length; i++) {
                undo[i].addEventListener('mouseenter',function () {
                    document.getElementById('undo').style.stroke = "#ffcb48"
                });

                undo[i].addEventListener('mouseleave',function () {
                    document.getElementById('undo').style.stroke = "#ff9a00"
                });
            }

            let redo = document.getElementsByClassName('redoButton');
            for(let i = 0; i<redo.length; i++) {
                redo[i].addEventListener('mouseenter',function () {
                    document.getElementById('redo').style.stroke = "#ffcb48"
                });

                redo[i].addEventListener('mouseleave',function () {
                    document.getElementById('redo').style.stroke = "#ff9a00"
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


                if (key === 17 && !openTools) {
                    openTools = true;
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

                    console.log("I HAVE TURNED 90 DEGREES MOTHER FUCKER");

                    expandTools("#createModeButton",0,-95);
                    expandTools("#deleteModeButton",105,-20);
                    expandTools("#extraModeButton",-105,-20);
                    expandTools("#undoModeButton",-50,90);
                    expandTools("#redoModeButton",50,90);

                    setTimeout(function () {
                        toolText.forEach(function(text) {
                            text.style.display = 'block';
                        });
                    }, 250);


                }

            }, 300));


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

                    console.log("I have turned NEGATIVE 90 DEGREES MOTHERFUCKER!");

                    expandTools("#createModeButton",0,0);
                    expandTools("#deleteModeButton",0,0);
                    expandTools("#extraModeButton",0,0);
                    expandTools("#undoModeButton",0,0);
                    expandTools("#redoModeButton",0,0);
                    setTimeout(function () {
                        toolButtons.style.display = 'none';
                    }, 250);
                }

            }, 300));

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


        }
    };
});