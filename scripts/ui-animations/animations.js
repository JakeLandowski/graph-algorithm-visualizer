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
                        duration: 500,
                        direction: 'reverse',
                    });
                } else {
                    menu.forEach(function(element) {
                        generateUI(element,200,200,50,delay);
                        delay = delay + 100;
                    });
                    text.innerHTML = "Hide UI";
                    drawLine('alternate',1000);
                }
            }));
        }
    };
});