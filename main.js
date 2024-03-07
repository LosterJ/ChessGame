let legalSquares=[];
let lastMove;
let lastColor;
let shadowMoveId;
let shadowMoveLast;
let shadowColor;
let isWhiteTurn = true;
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
        let column=String.fromCharCode(97+(i%8));
        let square=boardSquares[i];
        square.id=column+row;
    }
}

//sets up the drag and drop functionality for the pieces on the chess board and also sets their ids
function setupPieces() {
    for (let i=0;i<pieces.length;i++) {
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
    const pieceColor=piece.getAttribute("color");
    if((isWhiteTurn&&pieceColor=="white")||(!isWhiteTurn&&pieceColor=="black")) {

        ev.dataTransfer.setData("text",piece.id);
        const startingSquareId = piece.parentNode.id;
        getPossibleMoves(startingSquareId,piece);
        shadowMoveId=startingSquareId;
    }
}

//only allow a piece to be dropped when the target square's id is among the legal squares ids
function drop(ev) {
    ev.preventDefault();
    let data=ev.dataTransfer.getData("text");
    const piece=document.getElementById(data);
    const destinationSquare=ev.currentTarget;
    let destinationSquareId=destinationSquare.id;
    if(legalSquares.includes(destinationSquareId)) {
        if((isSquareOccupied(destinationSquare)=="blank")){
            destinationSquare.appendChild(piece);
            isWhiteTurn=!isWhiteTurn;
            legalSquares.length=0;
        } else {
            while(destinationSquare.firstChild) {
                destinationSquare.removeChild(destinationSquare.firstChild);
            }
            destinationSquare.appendChild(piece);
            isWhiteTurn=!isWhiteTurn;
            legalSquares.length=0;
        }
        if(typeof(lastMove)!="undefined") {
            lastMove.style.backgroundColor = lastColor;
            shadowMoveLast.style.backgroundColor=shadowColor;

        }
        lastMove=destinationSquare;
        lastColor=lastMove.style.backgroundColor;
        lastMove.style.backgroundColor = "#fff345";
        
        shadowMoveLast=document.getElementById(shadowMoveId)
        shadowColor=shadowMoveLast.style.backgroundColor;
        document.getElementById(shadowMoveId).style.backgroundColor="#fff377";
    } 
}

function getPossibleMoves(startingSquareId,piece) {
    const pieceColor=piece.getAttribute("color");
    if(piece.classList.contains("pawn")) {
        getPawnMoves(startingSquareId,pieceColor);
        console.log("pawnMove");
    }
    if(piece.classList.contains("knight")) {
        getKnightMoves(startingSquareId,pieceColor);
        console.log("knightMove");
    }
    if(piece.classList.contains("rook")) {
        getRookMoves(startingSquareId,pieceColor);
        console.log("RookMove");
    }
    if(piece.classList.contains("bishop")) {
        getBishopMoves(startingSquareId,pieceColor);
        console.log("bishopMove");
    }
    if(piece.classList.contains("queen")) {
        getQueenMoves(startingSquareId,pieceColor);
        console.log("queenMove");
    }
    if(piece.classList.contains("king")) {
        getKingMoves(startingSquareId,pieceColor);
        console.log("kingMove");
    }
}
    
//checks if a square is occupied by a piece, return piece's color or blank
function isSquareOccupied(square) {
    if(square.querySelector(".piece")) {
        console.log("🚀 ~ isSquareOccupied ~ square.querySelector:", square.querySelector(".piece"))
        const color = square.querySelector(".piece").color;
        return color;
    } else {
        return "blank";
    }
}

function getPawnMoves(startingSquareId,pieceColor) {
    checkPawnDiagonalCaptures(startingSquareId,pieceColor);
    checkPawnForwardMoves(startingSquareId,pieceColor);
}

//if two diagonal squares are the opposite color, it adds them to the legalSquares array
function checkPawnDiagonalCaptures(startingSquareId,pieceColor) {
    const file=startingSquareId.charAt(0);
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentFile=file;
    let currentRank=rankNumber;
    let currentSquareId=currentFile+currentRank;
    let currentSquare=document.getElementById(currentSquareId);
    const direction=pieceColor=="white" ? 1:-1;

    currentRank+=direction;
    for(let i=-1;i<=1;i+=2) {
        currentFile=String.fromCharCode(file.charCodeAt(0)+i);
        if(currentFile>="a" && currentFile<="h") {
            currentSquareId=currentFile+currentRank;
            currentSquare=document.getElementById(currentSquareId);
            squareContent=isSquareOccupied(currentSquare);
            if(squareContent!="blank" && squareContent!=pieceColor)
                legalSquares.push(currentSquareId);
        }
    }
}
function checkPawnForwardMoves(startingSquareId,pieceColor) {
    const file=startingSquareId.charAt(0);
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentFile=file;
    let currentRank=rankNumber;
    let currentSquareId=currentFile+currentRank;
    let currentSquare=document.getElementById(currentSquareId);
    const direction=pieceColor=="white" ? 1:-1;
    
    currentRank+=direction;
    currentSquareId=currentFile+currentRank;
    currentSquare=document.getElementById(currentSquareId);
    squareContent=isSquareOccupied(currentSquare);
    if(squareContent!="blank") return;
    legalSquares.push(currentSquareId);
    if(rankNumber!=2 && rankNumber!=7) return;
    currentRank+=direction;
    currentSquareId=currentFile+currentRank;
    currentSquare=document.getElementById(currentSquareId);
    squareContent=isSquareOccupied(currentSquare);
    if(squareContent!="blank") return;
    legalSquares.push(currentSquareId);
}

function getKnightMoves(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentFile=file;
    let currentRank=rankNumber;
    
    //lists the possible squares a knight can move to
    const moves = [
        [-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1],
    ];
    moves.forEach((move)=>{
        currentFile=file+move[0];
        currentRank=rankNumber+move[1];
        if(currentFile>=0 && currentFile<=7 && currentRank>0 && currentRank<=8) {
            let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
            let currentSquare=document.getElementById(currentSquareId);
            let squareContent=isSquareOccupied(currentSquare);
            if(squareContent!="blank" && squareContent==pieceColor) return;
            legalSquares.push(currentSquareId);
        }
    });
}

function getRookMoves(startingSquareId,pieceColor) {
    moveToEighthRank(startingSquareId,pieceColor);
    moveToFirstRank(startingSquareId,pieceColor);
    moveToAFile(startingSquareId,pieceColor);
    moveToHFile(startingSquareId,pieceColor);
}
function moveToEighthRank(startingSquareId,pieceColor) {
    const file=startingSquareId.charAt(0);
    const rank=startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;
    while(currentRank!=8) {
        currentRank++;
        let currentSquareId=file+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToFirstRank(startingSquareId,pieceColor) {
    const file=startingSquareId.charAt(0);
    const rank=startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;
    while(currentRank!=1) {
        currentRank--;
        let currentSquareId=file+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToAFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    let currentFile = file;
    while(currentFile!=0) {
        currentFile--;
        let currentSquareId=String.fromCharCode(currentFile+97)+rank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToHFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    let currentFile = file;
    while(currentFile!=7) {
        currentFile++;
        let currentSquareId=String.fromCharCode(currentFile+97)+rank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}

function getBishopMoves(startingSquareId,pieceColor){
    moveToEighthRankHFile(startingSquareId,pieceColor);
    moveToEighthRankAFile(startingSquareId,pieceColor);
    moveToFirstRankHFile(startingSquareId,pieceColor);
    moveToFirstRankAFile(startingSquareId,pieceColor);
}
function moveToEighthRankHFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentRank=rankNumber;
    let currentFile=file;
    while(currentFile!=7 && currentRank!=8) {
        currentFile++;
        currentRank++;
        let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToEighthRankAFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentRank=rankNumber;
    let currentFile=file;
    while(currentFile!=0 && currentRank!=8) {
        currentFile--;
        currentRank++;
        let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToFirstRankHFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentRank=rankNumber;
    let currentFile=file;
    while(currentFile!=7 && currentRank!=1) {
        currentFile++;
        currentRank--;
        let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}
function moveToFirstRankAFile(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentRank=rankNumber;
    let currentFile=file;
    while(currentFile!=0 && currentRank!=1) {
        currentFile--;
        currentRank--;
        let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
        let currentSquare=document.getElementById(currentSquareId);
        let squareContent=isSquareOccupied(currentSquare);
        if(squareContent!="blank" && squareContent==pieceColor) return;
        legalSquares.push(currentSquareId);
        if(squareContent!="blank" && squareContent!=pieceColor) return;
    }
}

function getQueenMoves(startingSquareId,pieceColor) {
    moveToEighthRank(startingSquareId,pieceColor);
    moveToFirstRank(startingSquareId,pieceColor);
    moveToAFile(startingSquareId,pieceColor);
    moveToHFile(startingSquareId,pieceColor);
    moveToEighthRankHFile(startingSquareId,pieceColor);
    moveToEighthRankAFile(startingSquareId,pieceColor);
    moveToFirstRankHFile(startingSquareId,pieceColor);
    moveToFirstRankAFile(startingSquareId,pieceColor);
}

function getKingMoves(startingSquareId,pieceColor) {
    const file=startingSquareId.charCodeAt(0)-97;
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank);
    let currentFile=file;
    let currentRank=rankNumber;
    
    //lists the possible squares a knight can move to
    const moves = [
        [-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1],
    ];
    moves.forEach((move)=>{
        currentFile=file+move[0];
        currentRank=rankNumber+move[1];
        if(currentFile>=0 && currentFile<=7 && currentRank>0 && currentRank<=8) {
            let currentSquareId=String.fromCharCode(currentFile+97)+currentRank;
            let currentSquare=document.getElementById(currentSquareId);
            let squareContent=isSquareOccupied(currentSquare);
            console.log("🚀 ~ moves.forEach ~ squareContent:", squareContent)
            if(squareContent!="blank" && squareContent==pieceColor) return;
            legalSquares.push(currentSquareId);
        }
    });
}