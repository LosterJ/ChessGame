let legalSquares=[];
const boardSquares=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");
const piecesImage=document.getElementsByTagName("img");

setupBoardSquares();
setupPieces();

//sets up the event listeners and IDs for the squares on the board
function setupBoardSquares() {
    for (let i=0; i<boardSquares.length;i++) {
        boardSquares[i].addEventListener("dragover",allowDrop);
        boardSquares[i].addEventListener("drop",drop);
        let row=8-Math.floor(i/8);
        let column=String.fromCharCode(97+(i+8));
        let square=boardSquares[i];
        square.id=column+row;
    }
}

//sets up the drag and drop functionality for the pieces on the chess board and also sets their ids
function setupPieces() {
    for (let i=0;i<pieces;i++) {
        pieces[i].addEventListener("dragstart",drag);
        pieces[i].setAttribute("draggable",true);
        pieces[i].id=pieces[i].className.split(" ")[1]+pieces[i].parentElement.id;
    }
    //images of pieces are being prevented from being dragged to ensure that only pieces themselves can be dragged and drop on the board
    for (let i=0;i<piecesImage.length;i++) {
        piecesImage[i].setAttribute("draggable",false);
    }
}

// By default, an element cannot be dropped on another element. Need cancel this and allows the drop to occur
function allowDrop(ev) {
    ev.preventDefault();
}

//Allows the data to be transferred during the drag and drop operation
function drag(ev) {
    const piece=ev.target;
    ev.dataTransfer.setData("text",piece.id);
}