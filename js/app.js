
// define some constants
const STARS_THRESHOLDS = [30, 20, 10];  // number of moves for loosing stars

// define some global variables for the stopwatch
let seconds = 0, minutes = 0, hours = 0, t;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// function to handle a card click
function cardClicked(event) {
    const card = event.target;

    card.classList.toggle('open');
    card.classList.toggle('show');

    cardsVerifyMatch();
}

// functin that verify if there is a match
function cardsVerifyMatch() {
    const allOpenCards = document.querySelectorAll('.open');
    const openCards = [];
    for (const card of allOpenCards) {
        if (!(card.classList.contains('match'))) {
            openCards.push(card);
        }
    }

    // when two cards open verify if they are a match
    if (openCards.length == 2) {
        // increment moves
        incMoves();

        // check cards
        const i1 = openCards[0].firstElementChild.className;
        const i2 = openCards[1].firstElementChild.className;
        if (i1 === i2) {
            for (const card of openCards) {
                card.classList.toggle('match');
            }

            // after a match found verify if game ends
            gameEnds();
        }
        else {
            // if open cards do not match close them
            openCards[0].classList.add('error');
            openCards[1].classList.add('error');
            cardsClose(openCards);
        }
    }
}

// increment moves counts
function incMoves() {
    // update moves counter
    let moves = document.querySelector('.moves').textContent;
    moves = Number(moves) + 1;
    document.querySelector('.moves').textContent = moves;

    // update moves text (singular or plural)
    let movesText = 'Moves';
    if (moves == 1) {
        movesText = 'Move';
    }
    document.querySelector('.moves-text').textContent = movesText;

    // update stars
    const stars = document.querySelectorAll('.star');
    for (let i = 0; i < STARS_THRESHOLDS.length; i++) {
        if (moves > STARS_THRESHOLDS[i]) {
            stars[i].firstElementChild.className = 'fa fa-star-o';
        }
    }

}

// close a list of open cards given as argument
function cardsClose(cards) {
    setTimeout( function() {
        for (const card of cards) {
            card.classList.remove('show', 'open', 'error');
        }
    }, 1000);
}

// verify if game ended, i.e. all cards are a match
function gameEnds() {
    const allMatchCards = document.querySelectorAll('.match');
    if (allMatchCards.length == 16) {
        clearTimeout(t);
        const moves = document.querySelector('.moves').textContent;
        const stars = document.querySelector('.stars').outerHTML;
        const time = document.querySelector('.stopwatch').textContent;
        document.querySelector('.modal-moves').textContent = moves;
        document.querySelector('.modal-stars').innerHTML = stars;
        document.querySelector('.modal-time').textContent = time;
        document.querySelector('.modal').style.display = 'block';
    }
}

// start/restart the game
function restartGame() {
    // shuffe board
    const myDeck = document.querySelector('.deck');
    const shuffled = shuffle([...document.querySelectorAll('.card')]);
    myDeck.innerHTML = '';
    for (const i of shuffled) {
        myDeck.appendChild(i);
    }

    // close and shake all cards
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
        card.classList.add('shaker');
        card.classList.remove('open', 'match', 'show');
    }

    // reset moves counter
    document.querySelector('.moves').textContent = '0';
    document.querySelector('.moves-text').textContent = 'Moves';

    // reset stars
    const stars = document.querySelectorAll('.star');
    for (star of stars) {
        star.firstElementChild.className = 'fa fa-star';
    }
    setTimeout(removeShaker, 1000);

    // reset stopwatch
    clearTimeout(t);
    seconds = 0; minutes = 0; hours = 0;
    timer();
}

// remove shaker class from cards after restart
function removeShaker() {
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
        card.classList.remove('shaker');
    }
}

// handle stopwatch
function tick() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    document.querySelector('.stopwatch').textContent =
      (hours ? (hours > 9 ? hours : "0" + hours) : "00")
        + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
          + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

// function to start stopwatch
function timer() {
    t = setTimeout(tick, 1000);
}

// add click event for all cards
const cards = document.querySelectorAll('.card');
for (const card of cards) {
  card.addEventListener('click', cardClicked);
}

// add click event for restart button
document.querySelector('.restart').addEventListener('click', restartGame);

// add click event for play again button
document.querySelector('.modal-button').addEventListener('click', function() {
    document.querySelector('.modal').style.display = 'none';
    restartGame();
});

// START GAME -- begin
restartGame();

