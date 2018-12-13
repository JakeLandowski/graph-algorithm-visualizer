/**
 *  @author Ryan Marlow
 *  7/28/18
 *  animation.js
 * 
 *  Code for animation the UI
 */

'use strict';

import Anime from './anime.js';

export default {
    start() {
        //Initial Delay
        let toolDelay = 0;
        let menuDelay = 0;

        //Dialogs shown/not shown
        let menuShown = false;
        let toolTipShown = false;
        let randomDialogShown = false;

        //Buttons
        let menuButton = document.getElementById('menu');
        let toolTipButton = document.getElementById('question-mark');
        let buttons = document.getElementsByClassName('buttons');
        let tools = document.getElementsByClassName('toolMenu');
        let newGraph = document.getElementsByClassName('newGraphButton');
        let createDialog = document.getElementById('create-dialog');
        let randomBtn = document.getElementsByClassName('randomButton');

        rotateMainMenu('#inner','normal',10000);
        rotateMainMenu('#outer','reverse',15000);
        addRandomGraphDialogFunctionality();

        newGraph.onclick = function () {
            createDialog.style.display = "block";
        };

        menuButton.onclick = function () {
            if (menuShown) {
                if(randomDialogShown) {
                    showRandomGraph();
                }

                hideMenu();
                menuShown = false;
            } else {
                document.getElementById('menuoptions').style.display = 'block';
                document.getElementById('menuButtons').style.display = 'block';
                showMenu();
                menuShown = true;
            }
        };

        toolTipButton.onclick = function () {
            if (toolTipShown) {
                toolTipDraw.reverse();
                toolTipDraw.play();
                showDialog('.tooltip-text',0);
            } else {
                toolTipDraw.reset();
                toolTipDraw.play();
                showDialog('.tooltip-text',1);
            }
            toolTipShown = !toolTipShown;
        };

        // //ANIMATION FUNCTIONS
        function rotateMainMenu(target,direction,duration) {
            let rotate = Anime({
                targets: target,
                rotate: '360',
                loop: true,
                duration: duration,
                direction: direction,
                easing: 'linear'
            });
        }

        function showDialog(target,opacity) {
            let showDialog = Anime({
                opacity: opacity,
                targets: target,
                duration: 250,
                delay: 250,
            });
        }

        function addRandomGraphDialogFunctionality() {
            for(let i = 0; i<randomBtn.length; i++) {
                randomBtn[i].addEventListener('click', function () {
                    showRandomGraph();
                });
            }
        }

        function showRandomGraph() {
            if (randomDialogShown) {
                document.getElementById('random-graph-dialog').style.display = "none";
                randomDialogSvg.reverse();
                randomDialogSvg.play();
                showDialog('#random-graph-dialog',0);
            } else {
                document.getElementById('random-graph-dialog').style.display = "block";
                randomDialogSvg.reset();
                randomDialogSvg.play();
                showDialog('#random-graph-dialog',1);
            }
            randomDialogShown = !randomDialogShown;
        }

        function rotateTools(target,duration,delay) {
            let rotate = Anime({
                opacity: 1,
                targets: target,
                rotate: '0',
                duration: duration,
                easing: 'easeInExpo',
                delay: delay
            });
        }

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
                rotateTools(buttons[i],700,menuDelay);
                menuDelay += 80;
            }

            for (let i = 0; i < tools.length; i++) {
                rotateTools(tools[i],600,toolDelay);
                toolDelay += 70;
            }

            hideInnerCircle.reverse();
            hideInnerCircle.play();

            hideOuterCircle.reverse();
            hideOuterCircle.play();
            toolDelay = 0;
            menuDelay = 0;
        }

        let randomDialogSvg = Anime({
            targets: '#random-graph-box',
            strokeDashoffset: [Anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'alternate',
            loop: false,
            autoplay: false
        });

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
            duration: 1500,
            loop: false,
        });

        let hideOuterCircle = Anime({
            opacity: 1,
            strokeDashoffset: [0, Anime.setDashoffset],
            targets: '#outer-circle',
            easing: 'linear',
            direction: 'alternate',
            duration: 1300,
            loop: false,
        });
    }
};