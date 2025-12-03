(function () {
    'use strict';
    console.log('reading JS');

    /*
        Need to track:
        * Current section
        * Time remaining
        * Score
        * Correct answers list
        * Incorrect answers list
        * Current guess
        * Current correct answer
        * Background colors
        * Map of fonts
        * Font loader
    */
    let currSection = "start";
    let time = 60;
    let timerID = null; // so we don't have multiple concurrent timers
    let score = 0;
    let correctAnswers = []; // note: can use push() to add to end of array
    let incorrectAnswers = [];
    let guess;
    let answer;
    const MAX_QUESTIONS = 50; // define maximum number of questions
    let numAnswered = 0;
    const BACKGROUNDS = [
        "#eddcd2", "#fff1e6", "#f0efeb", "#ddbea9", "#a5a58d", "#b7b7a4", "#edede9", "#d6ccc2", "#f5ebe0", "#e3d5ca", "#d5bdaf", "#f2e9e4", "#eaf4f4", "cad2c5", "#f4f1de", "#ebd4cb", "#f0ead2", "#ede0d4", "#d6d5c9", "#f5f1e3", "#eae4e9", "#fff1e6", "#fde2e4", "#f0efeb", "#faf3dd", "#daddd8", "#c8d5b9", "#d5c5c8", "#dab49d", "#cac4ce"
    ];
    const FONT_MAP = {
        "Abril Fatface": "abril-fatface.woff2",
        "Alegreya": "alegreya.woff2",
        "Archivo": "archivo.woff2",
        "Arial": "arial.woff2",
        "Avenir": "avenir.woff2",
        "Baskervville": "baskervville.woff2",
        "Bebas Neue": "bebas-neue.woff2",
        "Bodoni Moda": "bodoni-moda.woff2",
        "Brawler": "brawler.woff2",
        "Cabin": "cabin.woff2",
        "Comfortaa": "comfortaa.woff2",
        "Courier New": "courier-new.woff2",
        "Courier Prime": "courier-prime.woff2",
        "Crimson Text": "crimson-text.woff2",
        "DM Sans": "dm-sans.woff2",
        "Dosis": "dosis.woff2",
        "EB Garamond": "eb-garamond.woff2",
        "Fraunces": "fraunces.woff2",
        "Georgia": "georgia.woff2",
        "Happy Monkey": "happy-monkey.woff2",
        "Helvetica": "helvetica.woff2",
        "Inter": "inter.woff2",
        "Lato": "lato.woff2",
        "Lemon": "lemon.woff2",
        "Lexend": "lexend.woff2",
        "Lobster": "lobster.woff2",
        "Lora": "lora.woff2",
        "Merriweather": "merriweather.woff2",
        "Montserrat": "montserrat.woff2",
        "Neuton": "neuton.woff2",
        "Noto": "noto.woff2",
        "Nunito": "nunito.woff2",
        "Open Sans": "open-sans.woff2",
        "Oswald": "oswald.woff2",
        "Oxygen": "oxygen.woff2",
        "Pacifico": "pacifico.woff2",
        "Playfair Display": "playfair-display.woff2",
        "Poiret One": "poiret-one.woff2",
        "Poppins": "poppins.woff2",
        "Public Sans": "public-sans.woff2",
        "Quicksand": "quicksand.woff2",
        "Raleway": "raleway.woff2",
        "Righteous": "righteous.woff2",
        "Roboto": "roboto.woff2",
        "Rockwell": "rockwell.woff2",
        "Source Code Pro": "source-code-pro.woff2",
        "Times New Roman": "times-new-roman.woff2",
        "Ubuntu": "ubuntu.woff2",
        "Verdana": "verdana.woff2",
        "Work Sans": "work-sans.woff2"
    };

    function loadFont(fontName, file) {
        const style = document.createElement('style');
        style.innerHTML = `
        @font-face {
            font-family: '${fontName}';
            src: url('./fonts/${file}') format('woff2');
            font-weight: normal;
            font-style: normal;
        }
    `;
        document.head.appendChild(style);
    }

    /* Background color picker */
    function loadColor() {
        let i = Math.floor(Math.random() * BACKGROUNDS.length);
        document.body.classList.add("alt-bg");
        document.querySelector('.alt-bg').style.backgroundColor = BACKGROUNDS[i];
    }

    loadColor();

    /* Start page typeface animation */
    let active = true;
    function startPage() {
        active = true;

        // reset fields
        correctAnswers = [];
        incorrectAnswers = [];
        score = 0;
        time = 60;
        loadScore();

        // typeface animation
        const fonts = ["Bebas Neue", "Montserrat", "Pacifico", "Playfair Display", "Abril Fatface"];
        let i = 0;
        rotateFonts(i, fonts);
    }

    function rotateFonts(i, fonts) {
        if (!active) { return }
        const word = document.querySelector("#typeface");

        setTimeout(function () {
            word.style.fontFamily = fonts[i];
            i = (i + 1) % fonts.length;

            setTimeout(rotateFonts(i, fonts), 1000);
        }, 700);
    }

    /* Add audio */
    const buttonClick = new Audio('audio/click.mp3');
    const clock = new Audio('audio/clock.mp3');
    const correct = new Audio('audio/correct.mp3');
    const incorrect = new Audio('audio/incorrect.mp3');
    const endSound = new Audio('audio/end.mp3');

    // clock.play();

    document.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttonClick.play();
        });
    });

    /* Starting the game */
    startPage();
    const startButton = document.querySelector("#start button");
    startButton.addEventListener('click', function (event) {
        event.preventDefault();
        active = false;
        switchSection("guess");
        time = 60;
        startTimer();
    });

    /* Ending the game manually */
    document.querySelector('#end-game').addEventListener('click', function () {
        switchSection("end");
        clearTimeout(timerID);
        time = 60;
        document.querySelector('#time').innerHTML = time;
    });

    /* Replaying */
    document.querySelector('#replay').addEventListener('click', function () {
        switchSection("start");
    });

    /* Playing next question */
    document.querySelectorAll('.nextQuestion').forEach(function (element) {
        element.addEventListener('click', function () {
            console.log(numAnswered);
            if (numAnswered == MAX_QUESTIONS) {
                switchSection("end");
            } else {
                switchSection("guess");
            }
        });
    });

    /* Game timer */
    function startTimer() {
        clearTimeout(timerID);
        timerID = setTimeout(function () {
            if (time > 0) {
                document.querySelector('#time').innerHTML = time;
                time--;
                if (time == 7) {
                    clock.play();
                }
                startTimer();
            } else {
                switchSection("end");
            }
        }, 1000);
    }

    /* Section switching */
    function switchSection(section) {
        // enable score-timer header for all sections EXCEPT start and end

        // hide the current section
        let page = document.querySelector(`#${currSection}`);
        page.classList.remove("visible");
        page.classList.add("hidden");
        let newPage;

        if (section == "start") {
            newPage = document.querySelector('#start');
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");

            startPage();
        } else if (section == "guess") {
            newPage = document.querySelector('#guess');
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");

            newPage = document.querySelector("header");
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");
            playRound();
        } else if (section == "correct") {
            newPage = document.querySelector('#correct');
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");

            loadCorrectAnswer();
        } else if (section == "incorrect") {
            newPage = document.querySelector('#incorrect');
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");

            loadGuess();
            loadCorrectAnswer();
        } else {
            newPage = document.querySelector('#end');
            newPage.classList.remove("hidden");
            newPage.classList.add("visible");

            newPage = document.querySelector('header');
            newPage.classList.remove("visible");
            newPage.classList.add("hidden");

            loadScore();
            let corrList = document.querySelector('#correct-list');
            corrList.innerHTML = "";
            summary(correctAnswers, corrList);
            let wrongList = document.querySelector('#wrong-list');
            wrongList.innerHTML = "";
            summary(incorrectAnswers, wrongList);
            endSound.play();
        }
        currSection = section;
    }

    /* Set up button event listeners for correct / incorrect answers */
    for (let i = 1; i < 5; i++) {
        let btn = document.querySelector(`#o${i}`);
        btn.addEventListener('click', function () {
            if (btn.innerHTML == answer) {
                score++;
                loadScore();
                correctAnswers.push(answer); // add to correct list
                switchSection("correct");
                correct.play();
            } else {
                guess = btn.innerHTML;
                incorrectAnswers.push(answer);
                switchSection("incorrect");
                incorrect.play();
            }
        });
    }

    /* 
        Play round:
        * Load font
        * Load options
        * Compare guess versus correct
            * If right answer -> Award point, switch to Correct section 
            * If wrong answer -> Switch to Incorrect section
    */
    function playRound() {
        loadColor();
        loadPangram();
        loadOptions();
        numAnswered++;
    }

    let answerIndex, font;
    const fontlist = Object.keys(FONT_MAP);
    const fontfiles = Object.values(FONT_MAP);
    function loadPangram() {
        const pangram = document.querySelector('#guess h1');
        answerIndex = pickRandomFontIndex(false);
        if (answerIndex < 0) {
            switchSection("end");
        }
        font = fontlist[answerIndex];
        loadFont(font, fontfiles[answerIndex]);

        pangram.style.fontFamily = font;
        answer = font; // set as the correct answer
    }

    /* Select a random font with no repeats */
    function pickRandomFontIndex(repeats) {
        let index = Math.floor(Math.random() * fontlist.length);
        font = fontlist[index];
        for (let i = 0; i < correctAnswers.length; i++) {
            if (!repeats && font == correctAnswers[i]) {
                return pickRandomFontIndex(repeats);
            }
        }
        for (let i = 0; i < incorrectAnswers.length; i++) {
            if (!repeats && font == incorrectAnswers[i]) {
                return pickRandomFontIndex(repeats);
            }
        }
        return index;
    }

    function loadOptions() {
        // select option for correct answer
        let correctOption = Math.floor(Math.random() * 4) + 1;
        let rightAnswer = document.querySelector(`#o${correctOption}`);
        rightAnswer.innerHTML = answer;

        // fill remaining with random answers
        let usedFonts = [answerIndex];
        for (let i = 1; i < 5; i++) {
            if (i != correctOption) {
                let fontIndex = pickRandomFontIndex(true);

                while (usedFonts.includes(fontIndex)) {
                    fontIndex = pickRandomFontIndex(true);
                }
                usedFonts.push(fontIndex);
                document.querySelector(`#o${i}`).innerHTML = fontlist[fontIndex];
            }
        }
    }

    function loadScore() {
        document.querySelector('#score').innerHTML = score;
        document.querySelector('#end-score').innerHTML = score;
    }

    function loadCorrectAnswer() {
        document.querySelectorAll('.answer').forEach(function (element) {
            element.innerHTML = answer;
            element.style.fontFamily = answer;
        });
    }

    function loadGuess() {
        let wrong = document.querySelector('#wrong-answer');
        wrong.innerHTML = guess;
        loadFont(guess, FONT_MAP[guess]);
        wrong.style.fontFamily = guess;
    }

    function summary(answers, element) {
        for (let i = 0; i < answers.length; i++) {
            let str = document.createElement('p');
            str.innerHTML = answers[i];
            str.style.fontFamily = answers[i];
            element.appendChild(str);
        }
    }

}())