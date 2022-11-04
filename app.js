
const GameBoard = (() => {
    const gameBoard = Array.from(document.querySelectorAll('#gameBoard>div'))
    const spots = [
        'x', 'o', 'x',
        'o', 'o', 'x',
        'x', 'x', 'o',
    ];
    const render = () =>{
        gameBoard.forEach((spot,index) => {
            spot.innerHTML = `${spots[index]}`
        })
    }

    return {
        render
    }
})()

const Player = (marker) => {
    marker: marker;
    let score = 0;

    const getMarker = () => marker;
    const getScore = () => score;

    return {
        getMarker,
        getScore
    }
};

const playerOne = Player('x');
const playerTwo = Player('o');

GameBoard.render();