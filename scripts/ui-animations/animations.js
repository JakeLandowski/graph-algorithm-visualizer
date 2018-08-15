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

            window.onkeydown = function(e) {
                let key = e.keyCode ? e.keyCode : e.which;
                let toolButtons = document.querySelector("#toolbuttons");

                if (key === 17 && openTools === false) {
                    toolButtons.style.scale = .5;
                    toolButtons.style.left = xpos - 150;
                    toolButtons.style.top = ypos - 150;

                    let rotateToolMenu = Anime({
                        targets: '#toolbuttons',
                        rotate: '1turn',
                        loop: false,
                        duration: 250,
                        direction: 'reverse',
                        easing: 'linear'
                    });

                    toolButtons.style.display = 'block';
                    drawLine('#add-vertex','normal',250);
                    openTools = true;

                }
            };

            window.onkeyup = function(e) {
                let key = e.keyCode ? e.keyCode : e.which;
                let toolButtons = document.querySelector("#toolbuttons");

                if (key === 17 && openTools === true) {
                    drawLine('#add-vertex', 'reverse', 250);
                    setTimeout(function () {
                        toolButtons.style.display = 'none';
                        openTools = false;
                    }, 0);
                }
            };

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