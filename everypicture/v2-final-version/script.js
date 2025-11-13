
/*
    SOME IDEAS:
    * Change background color on hover over 'space', 'time', or 'being'
    * Image trail when cursor moves within those sections
    * On click, hide sections
    * Narrative - only reveal next section after first was explored. All available after 'being'
    
    * Space:
        * Letters expand on hover over header (return home on click)
        * Letters get pushed by cursor
        * Image carousel, pause on hover + caption on click
        * Background color = blues
    
    * Time:
        * Letters slightly expand and disappear on hover over header (return home on click)
        * Images arranged in a row, trigger fade out + caption fade in on hover (caption fades out)
        * OR fade to sepia filter
        * Background color = greens
    
    * Being:
        * Letters 'breathe' on hover (return home on click)
        * Centered image, show drag cursor on hover
        * As image is dragged in different areas on the screen, change image
        * Background color = reds
*/

(function () {
    'use strict';
    console.log('reading JS');

    /* MOUSEOVER IMAGE TRAIL */
    let section = document.querySelector('section');
    section.addEventListener('mousemove', reportPOS);
    let prevXPos = 0;
    let prevYPos = 0;
    let xPos;
    let yPos;
    let imgCount = 1;
    const maxImageCount = 14;
    const imgDistance = 100;

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
            pic.style.width = '100px';
            pic.style.pointerEvents = 'none';
            pic.style.maskImage = 'radial-gradient(circle at center, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 50%)';
            pic.style.opacity = '0.75';
            imgCount++;
            if (imgCount >= maxImageCount) {
                imgCount = 1;
                document.body.removeChild();
            }

            document.body.appendChild(pic);
            prevXPos = xPos;
            prevYPos = yPos;

            setTimeout(function () {
                pic.style.transition = 'opacity 0.5s ease';
                pic.style.opacity = '0';
                setTimeout(() => pic.remove(), 500);
            }, 500);
        }

    }

    /* SECTION VISIBILITY TOGGLE */
    // TODO: debug h3 hover appearances on home page, want progressive visibility
    let homeSection = document.querySelectorAll('.home-section');

    homeSection.forEach(function (section) {
        section.addEventListener('click', function (event) {
            let id = event.currentTarget.id;
            // if (id == 'home-space') {
            //     // switch to space 'page'
            //     nextPage = document.querySelector('#space');
            //     homePage.style.visibility = 'hidden';
            //     // homePage.style.opacity = '0';
            //     // // body.style.opacity = '0';
            //     // body.style.backgroundColor = 'white';
            //     // // body.className = 'bg visible bg-space';
            //     // body.classList.add('visible');
            //     nextPage.style.visibility = 'visible';
            //     nextPage.style.opacity = '100';
            //     //     // body.style.opacity = '100';
            //     //     // body.style.animation = 'bg-color-space 30s ease-in-out infinite alternate-reverse';
            //     //     // while(spacefunc());
            //     //     spacefunc();
            //     nextSection = document.querySelector('#home-time');
            //     nextSection.style.visibility = 'visible';
            // } else if (event.currentTarget.id == 'home-time') {
            //     // switch to time 'page'
            //     //     nextSection = document.querySelector('#home-being');
            //     //     nextSection.style.visibility = 'visible';
            // } else if (event.currentTarget.id == 'home-being') {
            //     // switch to being 'page'
            // }
            // let nextPageId;
            // if (id == 'home-space') nextPageId = 'space';
            // else if (id == 'home-time') nextPageId = 'time';
            // else if (id == 'home-being') nextPageId = 'being';

            // if (nextPageId) {
            //     switchPage(nextPageId);
            // }
            if (id == 'home-space') { // switch to space page
                switchPage('space');
                switchBackground('space');
                // document.querySelector('#home-time').style.opacity = '0.6';
                // document.querySelector('#home-time').classList.add('visible');
            } else if (id == 'home-time') { // switch to time page
                switchPage('time');
                switchBackground('time');
                // document.querySelector('#home-being').style.opacity = '0.6';
                // document.querySelector('#home-being').classList.add('visible');
            } else if (id == 'home-being') { // switch to being page
                switchPage('being');
                switchBackground('being');
            }
        });
    });

    function switchPage(pageName) {
        // get current visible page, remove visible class
        document.querySelector('.page.visible').classList.remove('visible');
        // set desired page to visible
        document.querySelector(`#${pageName}`).classList.add('visible');
        // clean up any extra images from Being Page
        document.querySelectorAll('.nodrag').forEach(function (image) {
            image.style.opacity = '0';
            setTimeout(function () {
                image.remove();
            }, 1000);

        });

    }

    function switchBackground(pageName) {
        // get current visible background, remove visible class
        document.querySelector('.bg.visible').classList.remove('visible');
        // set desired background to visible
        document.querySelector(`.bg.bg-${pageName}`).classList.add('visible');
    }

    /* RETURN TO HOME */
    let ret = document.querySelectorAll('.return');
    ret.forEach(function (r) {
        r.addEventListener('click', function (event) {
            switchPage('home');
            switchBackground('home');
        });
    });

    function spacefunc() {
        console.log('hi');
    };

    /* DRAGGABLE IMAGE */
    let imgIndex = 0;
    const imageNums = [1, 2, 5, 6, 9, 12];
    let img = document.querySelector('.draggable');
    let dragging = false;
    let x, y;

    img.addEventListener('mousedown', function (event) {
        event.preventDefault();
        dragging = true;
        x = event.clientX - img.offsetLeft;
        y = event.clientY - img.offsetTop;
        img.style.zIndex = 1000; // bring to front
        img.style.transition = 'none';
    });

    document.addEventListener('mousemove', function (event) {
        if (dragging) {
            img.style.left = `${event.clientX - x}px`;
            img.style.top = `${event.clientY - y}px`;
        }
        return;
    });

    document.addEventListener('mouseup', function (event) {
        if (dragging) {
            dragging = false;
            img.style.zIndex = 1;
            img.style.transition = 'opacity 1s ease';
            img.style.opacity = '0.1';

            setTimeout(function () {
                imgIndex++;
                if (imgIndex >= imageNums.length) {
                    imgIndex = 0;
                }
                // img.src = `images/image${imageNums[imgIndex]}.png`;
                let clone = img.cloneNode(true);
                let rect = img.getBoundingClientRect();
                clone.style.position = 'absolute';
                clone.style.left = rect.left;
                // clone.style.top = `${rect.top - rect.height}px`;
                clone.style.top = `${parseFloat(img.style.top) + img.offsetHeight + 9}px`;
                clone.style.zIndex = 0;
                clone.style.transition = 'opacity 1s ease';
                clone.style.opacity = '0.1';
                clone.style.width = '25vmin';
                // clone.draggable = false;
                clone.classList.remove('draggable'); // make sure it's not draggable again
                clone.classList.add('nodrag');
                document.body.appendChild(clone);

                img.src = `images/image${imageNums[imgIndex]}.png`;
                img.style.opacity = '1';
            }, 1000);
        }
    });

}());