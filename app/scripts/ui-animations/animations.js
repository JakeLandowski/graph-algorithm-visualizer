/**
 *  @author Ryan Marlow
 *  7/28/18
 *  animation.js
 * 
 *  Code for animation the UI
 */

'use strict';

import Anime from './anime.js';
import Util from '../utils/Util.js';

let primary = "#6ba2dc";
let secondary = "#2054a0";
let lightGray = "#9d9b98";
let darkGray = "#262626";
let white = "#fff";

//TODO: Ensure button functionality
//TODO: FIX THE CIRCLE SHIT
export default {
    start()
    {
        //Sets specific buttons as variables, set default delay at 0.
        let opacity;
        let toolDelay = 0;
        let menuDelay = 0;
        let menuShown = true;
        let toolTipShown = false;
        let eduModeStyle = false;
        let buttons = document.getElementsByClassName('buttons');
        let tools = document.getElementsByClassName('toolMenu');

        //alert(localStorage.getItem("graph"));

        let menuButton = document.getElementById('menu');
        menuButton.onclick = function () {
            if(menuShown){
                hideMenu();
                menuShown = false;
            } else {
                showMenu();
                menuShown = true;
            }
        };
        setHighlights();


        let toolTipButton = document.getElementById('question-mark');

        toolTipButton.onclick = function () {
            if(toolTipShown){
                console.log('hidetooltip');
                toolTipDraw.reverse();
                toolTipDraw.play();
            } else {
                console.log('showtooltip');
                toolTipDraw.reset();
                toolTipDraw.play();
            }
            toolTipShown = !toolTipShown;
        };

        let toolTipDraw = Anime({
            opacity: 1,
            targets: '#tool-tip-box',
            strokeDashoffset: [Anime.setDashoffset,0],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'alternate',
            loop: false,
            autoplay: false
        });

        //TODO: USE THIS CODE TO CREATE LOOP FOR ANIMATIONS AND FIX BUTTON FUNCTIONALITY
        //console.log(document.getElementsByTagName('circle'));
        function hideMenu() {
            for(let i = 0; i<buttons.length; i++) {
                let rotateMenu = Anime({
                    targets: buttons[i],
                    rotate: '90',
                    duration: 1000,
                    easing: 'easeInExpo',
                    delay: menuDelay
                });
                menuDelay += 100;
            }

            for(let i = 0; i<tools.length; i++) {
                let rotateTools = Anime({
                    targets: tools[i],
                    rotate: '90',
                    duration: 900,
                    easing: 'easeInExpo',
                    delay: toolDelay
                });
                toolDelay += 90;
            }

            let hideInnerCircle = Anime({
                strokeDashoffset: [0, Anime.setDashoffset],
                targets: '#inner-circle',
                easing: 'linear',
                direction: 'alternate',
                duration: 2000,
                loop: false,
            });

            let hideOuterCircle = Anime({
                strokeDashoffset: [0, Anime.setDashoffset],
                targets: '#outer-circle',
                easing: 'linear',
                direction: 'alternate',
                duration: 1800,
                loop: false,
            });

            menuDelay = 0;
            toolDelay = 0;
        }

        function showMenu() {
            for(let i = 0; i<buttons.length; i++) {
                let rotateMenu = Anime({
                    targets: buttons[i],
                    rotate: '0',
                    duration: 900,
                    easing: 'easeInExpo',
                    delay: menuDelay
                });
                menuDelay += 100;
            }

            for(let i = 0; i<tools.length; i++) {
                let rotateTools = Anime({
                    targets: tools[i],
                    rotate: '0',
                    duration: 800,
                    easing: 'easeInExpo',
                    delay: toolDelay
                });
                toolDelay += 90;
            }

            let showInnerCircle = Anime({
                strokeDashoffset: [0, Anime.setDashoffset],
                targets: '#inner-circle',
                easing: 'easeOutExpo',
                direction: 'reverse',
                duration: 1000,
                loop: false,
                delay: 1000
            });

            let showOuterCircle = Anime({
                strokeDashoffset: [0, Anime.setDashoffset],
                targets: '#outer-circle',
                easing: 'easeOutExpo',
                direction: 'reverse',
                duration: 900,
                loop: false,
                delay: 1000
            });
            toolDelay = 0;
            menuDelay = 0;
        }


        //ANIMATION FUNCTIONS
        let rotateOuter = Anime({
            targets: '#outer',
            rotate: '360',
            loop: true,
            duration: 10000,
            easing: 'linear'
        });

        let rotateInner = Anime({
            targets: '#inner',
            rotate: '360',
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
                    ui[i].style.stroke = primary;
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
                'undoButton','redoButton','eraseButton','createButton'];
            let elementIds = ['creategraphbutton','selectgraphbutton','eduModeButton',
                'add-vertex','add-edge','undoModeButton','redoModeButton','deleteModeButton','createModeButton'];

            let arrayOfElements;
            for(let i = 0; i<elements.length; i++) {
                arrayOfElements = document.getElementsByClassName(elements[i]);
                for(let j = 0; j<arrayOfElements.length; j++) {
                    arrayOfElements[j].addEventListener('mouseenter',function () {
                        document.getElementById(elementIds[i]).style.stroke = (eduModeStyle) ? darkGray : secondary;
                    });

                    arrayOfElements[j].addEventListener('mouseleave',function () {
                        document.getElementById(elementIds[i]).style.stroke = (eduModeStyle) ? lightGray : primary;
                    });
                }
            }

            let menuButton = document.getElementsByClassName('mainButton');
            for(let i = 0; i<menuButton.length; i++) {
                menuButton[i].addEventListener('mouseenter',function () {
                    document.getElementById('outer-spin-circle').style.stroke = (eduModeStyle) ? darkGray : secondary;
                    document.getElementById('inner-spin-circle').style.stroke = (eduModeStyle) ? darkGray : secondary;
                });

                menuButton[i].addEventListener('mouseleave',function () {
                    document.getElementById('outer-spin-circle').style.stroke = (eduModeStyle) ? lightGray : primary;
                    document.getElementById('inner-spin-circle').style.stroke = (eduModeStyle) ? lightGray : primary;
                });
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
// });