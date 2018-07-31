define(['ui-animations/anime'], function(Anime)
{
    return {
        start()
        {
            //Sets specific buttons as variables, set default delay at 0.
            let createNew = document.querySelector('#createnewbtn');
            let hideUI = document.querySelector('#hide-ui');
            let hideTools = document.querySelector('#hide-tools');
            let tools = document.querySelectorAll('.toolsbtn');
            let delay = 0;
            let openTools = true;

            generateUI(hideUI,200,200,25,0);
            generateUI(createNew,200,200,50,100);
            drawLine('alternate',1000);

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


            tools.forEach(function (element) {
                generateUI(element,-240,200,25,delay);
                delay = delay + 100;
            });


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


            hideUI.addEventListener('click', (function () {
                let text = document.getElementById("hide");
                if(text.innerHTML === "Hide UI") {
                    generateUI(createNew,-200,0,0,0);
                    text.innerHTML = "Show UI";
                    let lineDrawing = Anime({
                        targets: '#lineDrawing .lines path',
                        strokeDashoffset: [Anime.setDashoffset, 0],
                        easing: 'easeInOutSine',
                        duration: 500,
                        direction: 'reverse',
                    });
                } else {
                    generateUI(createNew,200,200,50,0);
                    text.innerHTML = "Hide UI";
                    drawLine('alternate',1000);
                }
            }));
        }
    };
});