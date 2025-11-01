(function () {
    'use strict';
    console.log('reading JS');

    // const p = document.querySelector('p');
    // let html = '';
    document.addEventListener('mousemove', reportPOS);
    let prevXPos = 0;
    let prevYPos = 0;
    let xPos;
    let yPos;
    let imgCount = 1;
    const maxImageCount = 14;
    let imgDistance;

    let form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        imgDistance = document.querySelector('input').value;
        console.log(imgDistance);
    });

    if (imgDistance === null || imgDistance < 0) {
        imgDistance = 50;
    }

    function reportPOS(event) {
        xPos = event.clientX;
        yPos = event.clientY;

        if (Math.abs(prevXPos - xPos) > imgDistance || Math.abs(prevYPos - yPos) > imgDistance) {
            let pic = document.createElement('img');
            pic.style.position = 'absolute';
            pic.style.left = `${xPos}px`;
            pic.style.top = `${yPos}px`;
            pic.src = `images/image${imgCount}.png`;
            pic.style.transform = 'translate(-50%, -50%';
            imgCount++;
            if (imgCount >= maxImageCount) {
                imgCount = 1;
                document.body.removeChild();
            }

            document.body.appendChild(pic);
            prevXPos = xPos;
            prevYPos = yPos;

            setTimeout(() => {
                pic.style.transition = 'opacity 0.5s ease';
                pic.style.opacity = '0';
                setTimeout(() => pic.remove(), 500);
            }, 2000);
        }

    }
}());