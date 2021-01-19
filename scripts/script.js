"use strict";

const msgContainerEl = document.querySelector(".message-container");
const msgTextEl = document.querySelector(".message-text");
const playerNameEl = document.querySelector(".playerName");
const msgBtnEl = document.querySelector(".message-btn");

const mainMenuEl = document.querySelector(".main-menu");
const aboutBtnEl = document.querySelector(".title span");
const categoriesEl = document.querySelector(".categories");
const playerScoresEl = document.querySelector(".playerScores");

const gameBoardEl = document.querySelector(".gameBoard");
const scoreEl = document.querySelector(".score span");
const secondsEl = document.querySelector(".seconds");
const questionEl = document.querySelector(".question p");
const questionImgEl = document.querySelector(".question img");
const answersEl = document.querySelector(".answers .row");

let score = 0;
let subject;
let correctAnswers = [];

const gameQuestions = {
  space: {
    question: "Which celestial object is this?",
    answers: [
      "mars",
      "venus",
      "earth",
      "mercury",
      "jupiter",
      "saturn",
      "neptune",
      "uranus",
      "pluto",
    ],
  },
  starTrek: {
    question: "Which Star Trek character is this?",
    answers: [
      "bashir",
      "sisko",
      "dax",
      "janeway",
      "kirk",
      "neelix",
      "picard",
      "q",
      "riker",
      "scotty",
      "spock",
      "tuvok",
      "uhura",
      "worf",
    ],
  },
  dogs: {
    question: "What breed of dog is this?",
    answers: [
      "bulldog",
      "poodle",
      "beagle",
      "boxer",
      "chihuahua",
      "dachshund",
      "dalmation",
      "doberman",
      "greyhound",
      "labradoodle",
      "labrador",
      "pointer",
      "rottweiler",
      "terrier",
    ],
  },
  artists: {
    question: "Who painted this?",
    answers: [
      "vangogh",
      "dali",
      "delacroix",
      "magritte",
      "munch",
      "pollock",
      "rembrandt",
      "schiele",
      "seurat",
      "vermeer",
      "watteau",
      "warhol",
      "picasso",
    ],
  },
};

let scoreBoard;
if (!localStorage.getItem("popQuiz")) {
  localStorage.setItem("popQuiz", JSON.stringify([["Hal9000", "space", 2]]));
}
scoreBoard = JSON.parse(localStorage.getItem("popQuiz"));

function displayScoreBoard(scoreArr) {
  playerScoresEl.innerHTML = "";
  scoreArr.sort((a, b) => {
    return b[2] - a[2];
  });
  scoreArr.forEach((s) => {
    playerScoresEl.insertAdjacentHTML(
      `beforeend`,
      `
    <div class="scoreBoard-entry row">
          <div class="col-4 score-name">${s[0]}</div>
          <div class="col-4 score-category">${s[1]}</div>
          <div class="col-4 score-score">${s[2]}</div>
        </div>`
    );
  });
}
displayScoreBoard(scoreBoard);

function postScore(name, cat, score) {
  if (name === "") name = "Anonymous";
  scoreBoard.push([name, cat, score]);

  localStorage.setItem("popQuiz", JSON.stringify(scoreBoard));

  displayScoreBoard(scoreBoard);
}

function displayCategories() {
  const categories = Object.keys(gameQuestions);
  categories.forEach((cat) => {
    const catEl = document.createElement("div");
    catEl.style.backgroundImage = `url("assets/${cat}.jpeg")`;
    catEl.classList.add("col-6");
    categoriesEl.appendChild(catEl);
  });
}
displayCategories();

function setTimer(s) {
  secondsEl.style.color = "black";
  let timeRemaining = s;
  displayTimer(timeRemaining);
  let countDown = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      displayTimer(timeRemaining);
    } else {
      clearInterval(countDown);
      endGame();
    }
  }, 1000);
}

function displayTimer(t) {
  secondsEl.textContent = t;
  if (t <= 5) secondsEl.style.color = "red";
}

function displayScore() {
  scoreEl.textContent = score;
}

function getRandomArrEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseImgSrc(src) {
  return src.slice(src.lastIndexOf("/") + 1, src.indexOf(".jpeg"));
}
function generateAnswers() {
  let answer = getRandomArrEl(gameQuestions[subject].answers);

  if (correctAnswers.includes(answer)) {
    return generateAnswers();
  } else {
    let possibleAnswers = [];
    possibleAnswers.push(answer);
    questionImgEl.src = `./assets/${subject}/${answer}.jpeg`;
    while (possibleAnswers.length < 4) {
      let ans = getRandomArrEl(gameQuestions[subject].answers);
      if (!possibleAnswers.includes(ans)) {
        possibleAnswers.push(ans);
      }
    }
    return possibleAnswers;
  }
}

function askNewQuestion() {
  answersEl.innerHTML = "";
  let answers = generateAnswers();
  while (answers.length > 0) {
    const del = Math.floor(Math.random() * answers.length);
    const [...ans] = answers.splice(del, 1);
    answersEl.insertAdjacentHTML(
      "afterbegin",
      `
    <button class="answer py-3 my-2 btn btn-block btn-primary" value="${ans}">
            ${ans}
          </button>
    `
    );
  }
}

function endGame() {
  msgBtnEl.textContent = "Post Score";
  playerNameEl.style.display = "block";
  displayMessage(`
      Game over
      Final score: ${score}
      `);
}

function newQuiz(subj) {
  score = 0;
  subject = subj;
  correctAnswers = [];

  displayScore();

  questionEl.textContent = gameQuestions[subject].question;

  setTimer(20);

  askNewQuestion();
}

function displayMessage(msg) {
  msgTextEl.textContent = msg;
  if (msgContainerEl.classList.contains("hidden"))
    msgContainerEl.classList.toggle("hidden");
}

msgBtnEl.addEventListener("click", (e) => {
  msgContainerEl.classList.toggle("hidden");
  switch (msgBtnEl.textContent) {
    case "Post Score":
      postScore(playerNameEl.value, subject, score);
      playerNameEl.style.display = "none";
      mainMenuEl.classList.toggle("hidden");
      gameBoardEl.classList.toggle("hidden");
  }
});

aboutBtnEl.addEventListener("click", () => {
  msgBtnEl.textContent = "Got it";
  displayMessage(
    "How to play: Answer as many questions in 20 seconds. When the time is up submit your score to the score board."
  );
});

mainMenuEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("categories")) return;
  const topic = parseImgSrc(e.target.style.backgroundImage);
  newQuiz(topic);
  mainMenuEl.classList.toggle("hidden");
  gameBoardEl.classList.toggle("hidden");
});

answersEl.addEventListener("click", (e) => {
  if (e.target.classList[0] !== "answer") return;
  let answer = parseImgSrc(questionImgEl.src);
  if (answer === e.target.value) {
    correctAnswers.push(answer);
    score++;
    displayScore();
    if (gameQuestions[subject].answers.length !== correctAnswers.length) {
      askNewQuestion();
    } else {
      endGame();
    }
  } else {
    msgBtnEl.textContent = "Close";
    displayMessage("Try again");
  }
});

//Things to do:
//Local storage scoreboard
//readme file
