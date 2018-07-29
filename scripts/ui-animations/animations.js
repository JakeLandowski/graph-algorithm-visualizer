define(['ui-animations/anime'], function(Anime)
{
    return {
        start()
        {

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

            let createNew = document.querySelector('#createnewbtn');
            let hideUI = document.querySelector('#hide-ui');
            generateUI(hideUI,200,200,25,250);
            generateUI(createNew,200,200,50,350);

            hideUI.addEventListener('click', (function () {
                let text = document.getElementById("hide");
                if(text.innerHTML === "Hide UI") {
                    generateUI(createNew,-200,0,0,0);
                    text.innerHTML = "Show UI";
                } else {
                    generateUI(createNew,200,200,50,0);
                    text.innerHTML = "Hide UI";
                }
            }));

            let lineDrawing = Anime({
                targets: '#lineDrawing .lines path',
                strokeDashoffset: [Anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: 'alternate',
                loop: true
            });
        }
    };
});