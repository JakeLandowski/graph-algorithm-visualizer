define(['ui-animations/anime'], function(Anime)
{
    return {
        start()
        {
            let pathEls = document.querySelectorAll('path');
            for (let i = 0; i < pathEls.length; i++) {
                let pathEl = pathEls[i];
                let offset = Anime.setDashoffset(pathEl);
                pathEl.setAttribute('stroke-dashoffset', offset);
                Anime({
                    targets: pathEl,
                    strokeDashoffset: [offset, 0],
                    duration: Anime.random(1000, 3000),
                    delay: Anime.random(0, 2000),
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                    autoplay: true
                });
            }
        }
    };
});