"use strict";

const socket = io();

let score = 0;
const winningScore = 100;
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
let currentPlayer = document.querySelector(".player--active");
const dice = document.querySelector(".dice");

function resetAll() {
    btnRoll.disabled = false;
    btnHold.disabled = false;
    if (document.querySelector(".player--active").classList.contains("player--1")) {
        switchPlayer();
    }
    dice.style.display = "none";
    document.querySelectorAll(".score").forEach((score) => {
        score.textContent = "0";
    });
    document.querySelectorAll(".current-score").forEach((score) => {
        score.textContent = "0";
    });
}

resetAll();

btnNew.addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to reset?");
    if (!confirmation) {
        return;
    }
    resetAll();
    socket.emit('resetGame');
});

btnRoll.addEventListener("click", () => {
    const diceNum = Math.trunc(Math.random() * 6) + 1;
    const diceName = `dice-${diceNum}.png`;
    dice.src = diceName;
    dice.style.display = "initial";

    socket.emit('rollDice', diceNum);

    // if (diceNum === 1) {
    //     switchPlayer();
    // } else {
    //     score += diceNum;
    //     currentPlayer.querySelector(".current-score").textContent =
    //         String(score);
    // }
});

btnHold.addEventListener("click", () => {
    let totalScore = Number(currentPlayer.querySelector(".score").textContent) + score;
    // currentPlayer.querySelector(".score").textContent = totalScore;

    socket.emit('holdScore', { player: currentPlayer.classList[1], totalScore });

    // if (totalScore >= winningScore) {
    //     console.log("🎉Winner");
    //     btnRoll.disabled = true;
    //     btnHold.disabled = true;

    //     currentPlayer.querySelector(".score").innerHTML += `<p style="font-size:50%; color: green; font-weight: bold; text-align: center;">🎉Winner</p>`;
    // }
    // switchPlayer();
});

function switchPlayer() {
    score = 0;
    document.querySelectorAll(".current-score").forEach((score) => {
        score.textContent = "0";
    });
    if (currentPlayer.classList.contains("player--0")) {
        document.querySelector(".player--1").classList.add("player--active");
        document.querySelector(".player--0").classList.remove("player--active");
    } else if (currentPlayer.classList.contains("player--1")) {
        document.querySelector(".player--0").classList.add("player--active");
        document.querySelector(".player--1").classList.remove("player--active");
    }
    currentPlayer = document.querySelector(".player--active");
}

socket.on('diceRolled', (diceNum) => {
    const diceName = `dice-${diceNum}.png`;
    dice.src = diceName;
    dice.style.display = "initial";

    if (diceNum === 1) {
        switchPlayer();
    } else {
        score += diceNum;
        currentPlayer.querySelector(".current-score").textContent = String(score);
    }
});

socket.on('scoreHeld', ({ player, totalScore }) => {
    const playerElem = document.querySelector(`.${player}`);
    playerElem.querySelector(".score").textContent = totalScore;
    
    if (totalScore >= winningScore) {
        console.log("🎉Winner");
        btnRoll.disabled = true;
        btnHold.disabled = true;

        currentPlayer.querySelector(".score").innerHTML += `<p style="font-size:50%; color: green; font-weight: bold; text-align: center;">🎉Winner</p>`;
    }
    switchPlayer();
});

socket.on('gameReset', resetAll);


// "use strict";

// let score = 0;
// const winningScore = 100
// const btnNew = document.querySelector(".btn--new");
// const btnRoll = document.querySelector(".btn--roll");
// const btnHold = document.querySelector(".btn--hold");
// let currentPlayer = document.querySelector(".player--active");
// const dice = document.querySelector(".dice");

// function resetAll() {
//     btnRoll.disabled = false;
//     btnHold.disabled = false;
//     if (document.querySelector(".player--active").classList.contains("player--1")) {
//         switchPlayer();
//     }
//     dice.style.display = "none";
//     document.querySelectorAll(".score").forEach((score) => {
//         score.textContent = "0";
//     });
//     document.querySelectorAll(".current-score").forEach((score) => {
//         score.textContent = "0";
//     });
// }

// resetAll();

// btnNew.addEventListener("click", () => {
//     const confirmation = confirm("Are you sure you want to reset?");
//     if (!confirmation) {
//         return;
//     }
//     resetAll();
// });

// btnRoll.addEventListener("click", () => {
//     const diceNum = Math.trunc(Math.random() * 6) + 1;
//     const diceName = `dice-${diceNum}.png`;
//     dice.src = diceName;
//     dice.style.display = "initial";

//     if (diceNum === 1) {
//         switchPlayer();
//     } else {
//         score += diceNum;
//         currentPlayer.querySelector(".current-score").textContent =
//             String(score);
//     }
// });

// btnHold.addEventListener("click", () => {
//     let totalScore =
//         Number(currentPlayer.querySelector(".score").textContent) + score;
//     currentPlayer.querySelector(".score").textContent = totalScore;
//     if (totalScore >= winningScore) {
//         console.log("🎉Winner");
//         btnRoll.disabled = true;
//         btnHold.disabled = true;

//         currentPlayer.querySelector(
//             ".score"
//         ).innerHTML += `<p style="font-size:50%; color: green; font-weight: bold; text-align: center;">🎉Winner</p>`;
//     }
//     switchPlayer();
// });

// function switchPlayer() {
//     score = 0;
//     document.querySelectorAll(".current-score").forEach((score) => {
//         score.textContent = "0";
//     });
//     if (currentPlayer.classList.contains("player--0")) {
//         document.querySelector(".player--1").classList.add("player--active");
//         document.querySelector(".player--0").classList.remove("player--active");
//     } else if (currentPlayer.classList.contains("player--1")) {
//         document.querySelector(".player--0").classList.add("player--active");
//         document.querySelector(".player--1").classList.remove("player--active");
//     }
//     // document.querySelector(".player--1").classList.toggle("player--active")
//     // document.querySelector(".player--0").classList.toggle("player--active")
//     currentPlayer = document.querySelector(".player--active");
// }


