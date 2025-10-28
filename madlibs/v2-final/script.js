(function () {
    "use strict";
    console.log('reading js');

    const theForm = document.querySelector('form');
    const replay = document.querySelector('#play-again');
    theForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const toPerson = document.querySelector('#to-person').value;
        const noun1 = document.querySelector('#noun1').value;
        const noun2 = document.querySelector('#noun2').value;
        const noun3 = document.querySelector('#noun3').value;
        const fromPerson = document.querySelector('#from-person').value;

        let myText;

        if (toPerson == '') {
            myText = "Please provide a name of a person";
            document.querySelector('#to-person').focus();
        }
        else if (noun1 == '') {
            myText = "Please provide a noun";
            document.querySelector('#noun1').focus();
        }
        else if (noun2 == '') {
            myText = "Please provide a noun";
            document.querySelector('#noun2').focus();
        }
        else if (noun3 == '') {
            myText = "Please provide a noun";
            document.querySelector('#noun3').focus();
        }
        else if (fromPerson == '') {
            myText = "Please provide a name";
            document.querySelector('#from-person').focus();
        }
        else {
            document.querySelector('#ml-to-person').innerHTML = toPerson;
            document.querySelector('#ml-noun1').innerHTML = noun1;
            document.querySelector('#ml-noun2').innerHTML = noun2;
            document.querySelector('#ml-noun3').innerHTML = noun3;
            document.querySelector('#ml-from-person').innerHTML = fromPerson;

            document.querySelector('#to-person').value = '';
            document.querySelector('#noun1').value = '';
            document.querySelector('#noun2').value = '';
            document.querySelector('#noun3').value = '';
            document.querySelector('#from-person').value = '';

            // reveal the madlib
            document.querySelector('#cover').className = 'left';
        }
    });

    replay.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('#to-person').value = '';
        document.querySelector('#noun1').value = '';
        document.querySelector('#noun2').value = '';
        document.querySelector('#noun3').value = '';
        document.querySelector('#from-person').value = '';

        // hide madlib
        document.querySelector('#cover').classList.remove('left');
    });

}());