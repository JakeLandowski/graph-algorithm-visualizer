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
    start() {
        //Sets specific buttons as variables, set default delay at 0.
        let opacity;
        let toolDelay = 0;
        let menuDelay = 0;
        let menuShown = false;
        let toolTipShown = false;
        let eduModeStyle = false;
        let menuButton = document.getElementById('menu');
        let toolTipButton = document.getElementById('question-mark');
        let buttons = document.getElementsByClassName('buttons');
        let tools = document.getElementsByClassName('toolMenu');
        //alert(localStorage.getItem("graph"));

        menuButton.onclick = function () {
            if (menuShown) {
                hideMenu();
                menuShown = false;
            } else {
                showMenu();
                menuShown = true;
            }
        };

        toolTipButton.onclick = function () {
            if (toolTipShown) {
                toolTipDraw.reverse();
                toolTipDraw.play();

                let toolTipText = Anime({
                    opacity: 0,
                    targets: ".tooltip-text",
                    duration: 250,
                    delay: 250,
                });
            } else {
                toolTipDraw.reset();
                toolTipDraw.play();

                let toolTipText = Anime({
                    opacity: 1,
                    targets: ".tooltip-text",
                    duration: 250,
                    delay: 250,
                });
            }
            toolTipShown = !toolTipShown;
        };



        let toolTipDraw = Anime({
            opacity: 1,
            targets: '#tool-tip-box',
            strokeDashoffset: [Anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'alternate',
            loop: false,
            autoplay: false
        });

        let hideInnerCircle = Anime({
            opacity: 1,
            strokeDashoffset: [0, Anime.setDashoffset],
            targets: '#inner-circle',
            easing: 'linear',
            direction: 'alternate',
            duration: 2000,
            loop: false,
        });

        let hideOuterCircle = Anime({
            opacity: 1,
            strokeDashoffset: [0, Anime.setDashoffset],
            targets: '#outer-circle',
            easing: 'linear',
            direction: 'alternate',
            duration: 1800,
            loop: false,
        });

        //TODO: USE THIS CODE TO CREATE LOOP FOR ANIMATIONS AND FIX BUTTON FUNCTIONALITY
        //console.log(document.getElementsByTagName('circle'));
        function hideMenu() {
            for (let i = 0; i < buttons.length; i++) {
                let rotateMenu = Anime({
                    opacity: 0,
                    targets: buttons[i],
                    rotate: '90',
                    duration: 1000,
                    easing: 'easeInExpo',
                    delay: menuDelay
                });
                menuDelay += 100;
            }

            for (let i = 0; i < tools.length; i++) {
                let rotateTools = Anime({
                    opacity: 0,
                    targets: tools[i],
                    rotate: '90',
                    duration: 900,
                    easing: 'easeInExpo',
                    delay: toolDelay
                });
                toolDelay += 90;
            }

            hideInnerCircle.reset();
            hideOuterCircle.reset();
            hideInnerCircle.play();
            hideOuterCircle.play();

            menuDelay = 0;
            toolDelay = 0;
        }


        function showMenu() {
            for (let i = 0; i < buttons.length; i++) {
                let rotateMenu = Anime({
                    opacity: 1,
                    targets: buttons[i],
                    rotate: '0',
                    duration: 900,
                    easing: 'easeInExpo',
                    delay: menuDelay
                });
                menuDelay += 100;
            }

            for (let i = 0; i < tools.length; i++) {
                let rotateTools = Anime({
                    opacity: 1,
                    targets: tools[i],
                    rotate: '0',
                    duration: 800,
                    easing: 'easeInExpo',
                    delay: toolDelay
                });
                toolDelay += 90;
            }

            hideInnerCircle.reverse();
            hideInnerCircle.play();

            hideOuterCircle.reverse();
            hideOuterCircle.play();
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
    }
};
// });