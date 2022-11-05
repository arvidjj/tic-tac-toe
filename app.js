
const GameFlow = (() => {

})()

const GameBoard = (() => {
    const gameBoard = Array.from(document.querySelectorAll('#gameBoard>div'))
    const spots = [
        '', 'o', 'x',
        'o', 'o', 'x',
        'x', 'x', 'o',
    ];

    gameBoard.forEach((spot) => {
        spot.addEventListener('click', () =>{
            console.log('clicked ' + spot.getAttribute('id'))
            return this
        })
    })

    const addSpot = (place, marker) => {
        if (spots[place] === '') {
            spots[place] = marker;
            render();
        } else {
            console.log('this place is taken!')
        }
    }

    const render = () =>{
        gameBoard.forEach((spot,index) => {
            spot.innerHTML = `${spots[index]}`
        })
    }
    const getGameBoard = () => gameBoard
    return {
        addSpot, render, getGameBoard
    }
})()

const Player = (marker) => {
    marker: marker;
    let score = 0;

    const getMarker = () => marker;
    const getScore = () => score;

    const placeMarker = () => {
        let gameBoard = GameBoard.getGameBoard();
        let index = 0;

        console.log('Placing ' + marker + ' at ' + index)
        GameBoard.addSpot(index , marker)
    }

    return {
        getMarker, getScore, placeMarker
    }
};

const playerOne = Player('x');
const playerTwo = Player('o');

GameBoard.render();