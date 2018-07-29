define(['ui-animations/anime'], function(Anime)
{
    return {
        start()
        {
            let pathEls = document.querySelectorAll('path');
            for (let i = 0; i < pathEls.length; i++) {
                let pathEl = pathEls[i];
                let offset = anime.setDashoffset(pathEl);
                pathEl.setAttribute('stroke-dashoffset', offset);
                anime({
                    targets: pathEl,
                    strokeDashoffset: [offset, 0],
                    duration: anime.random(1000, 3000),
                    delay: anime.random(0, 2000),
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                    autoplay: true
                });
            }
        }
    };
});