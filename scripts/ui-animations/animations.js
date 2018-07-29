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
        }
    };
});