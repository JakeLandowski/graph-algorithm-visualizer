/**
 *  @author Ryan Marlow
 *  7/28/18
 *  animation.js
 * 
 *  Code for animation the UI
 */

'use strict';
define(['../../../Portfolio/js/anime','utils/Util'], function(Anime,Util)
{
    let lightOrange = "#ffcb48";
    let darkOrange = "#ff9a00";
    let lightGray = "#9d9b98";
    let darkGray = "#262626";
    let white = "#fff";

    return {
        start()
        {
            //Sets specific buttons as variables, set default delay at 0.
            let xpos;
            let ypos;
            let menu = document.querySelectorAll('.menubtn');
            let delay = 0;
            let openTools = true;
            let eduModeStyle = false;

            document.onmousemove = findDocumentCoords;

            menu.forEach(function (element) {
                generateUI(element,200,200,50,delay);
                delay = delay + 100;
            });
            setHighlights();

            let eduMode = document.getElementsByClassName('eduMode');
            for(let i = 0; i<eduMode.length; i++) {
                eduMode[i].addEventListener('click',function () {
                    swapStyleSheet('graphedu.css');
                });
            }

            drawLine('.menuRectangleButton',reverse,500);

            function findDocumentCoords(mouseEvent) {
                if (mouseEvent) {
                    //FireFox
                    xpos = mouseEvent.pageX;
                    ypos = mouseEvent.pageY;
                } else {
                    //IE
                    xpos = window.event.x + document.body.scrollLeft - 2;
                    ypos = window.event.y + document.body.scrollTop - 2;
                }
            }

            window.addEventListener('keydown', Util.throttle(function(e)
            {
                let key = e.keyCode ? e.keyCode : e.which;
                let toolButtons = document.querySelector("#toolbuttons");
                let toolText = document.querySelectorAll(".toolText");

                if (key === 17 && openTools && !e.repeat) {
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

                if (key === 17) {
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
                    eduModeStyle = false;
                } else {
                    document.getElementById('pagestyle').setAttribute('href', 'css/graphedu.css');
                    for(let i = 0; i<ui.length; i++) {
                        ui[i].style.stroke = darkGray;
                    }
                    eduModeStyle = true;
                }
            }

            function setHighlights() {
                let elements = ['creategraph','selectgraph','eduMode','addVertexButton','addEdgeButton',
                    'addWeightButton','undoButton','redoButton','deleteButton','createButton','extraButton'];
                let elementIds = ['creategraphbutton','selectgraphbutton','eduModeButton',
                    'add-vertex','add-edge','edit-edge','undo','redo','deleteModeButton','createModeButton',
                    'extraModeButton'];

                let arrayOfElements;
                for(let i = 0; i<elements.length; i++) {
                    arrayOfElements = document.getElementsByClassName(elements[i]);
                    for(let j = 0; j<arrayOfElements.length; j++) {
                        arrayOfElements[j].addEventListener('mouseenter',function () {
                            document.getElementById(elementIds[i]).style.stroke = (eduModeStyle) ? lightGray : lightOrange;
                        });

                        arrayOfElements[j].addEventListener('mouseleave',function () {
                            document.getElementById(elementIds[i]).style.stroke = (eduModeStyle) ? darkGray : darkOrange;
                        });
                    }
                }
            }

        }, swapColors(graph,primary,secondary,bg) {
            //Change graph colors on click
            graph.config.backgroundColor[0] = bg;
            graph.config.vertexOutlineColor[0] = primary;
            graph.config.vertexTextColor[0] = primary;
            graph.config.vertexHoverColor[0] = secondary;
            graph.config.vertexSelectColor[0] = secondary;
            graph.config.edgeLineColor[0] = primary;
            graph.config.edgeTextColor[0] = primary;
            graph.config.edgeArrowColor[0] = primary;
            graph.config.edgeHoverColor[0] = secondary;
            graph.config.trackingEdgeColor[0] = secondary;
        }
    };
});