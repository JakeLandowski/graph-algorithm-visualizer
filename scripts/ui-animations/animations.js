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


            function hotkeyMenu(e) {
                if (e.ctrlKey) {
                    // call your function to do the thing
                    displayToolMenu();
                }
            }
// register the handler
            document.addEventListener('keyup', hotkeyMenu, false);

            //ANIMATION FUNCTIONS
            function displayToolMenu() {
                let toolButtons = document.querySelector("#toolbuttons");
                let container = document.body;

                container.addEventListener("click", getClickPosition, false);

                function getClickPosition(e) {
                    let parentPosition = getPosition(container);
                    let xPosition = e.clientX - parentPosition.x - (toolButtons.clientWidth / 2);
                    let yPosition = e.clientY - parentPosition.y - (toolButtons.clientHeight / 2);

                    toolButtons.style.left = xPosition + "px";
                    toolButtons.style.top = yPosition + "px";
                }

                // Helper function to get an element's exact position
                function getPosition(el) {
                    let xPos = 0;
                    let yPos = 0;

                    while (el) {
                        if (el.tagName == "BODY") {
                            // deal with browser quirks with body/window/document and page scroll
                            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                            let yScroll = el.scrollTop || document.documentElement.scrollTop;

                            xPos += (el.offsetLeft - xScroll + el.clientLeft);
                            yPos += (el.offsetTop - yScroll + el.clientTop);
                        } else {
                            // for all other non-BODY elements
                            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
                        }

                        el = el.offsetParent;
                    }
                    return {
                        x: xPos,
                        y: yPos
                    };
                }
            }


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