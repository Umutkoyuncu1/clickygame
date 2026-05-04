// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left. setInterval();

// Variables
// ===== STATE =====
let score = 0;
let timeLeft = 5;
let gameState = "idle"; // idle | playing | ended
let interval = null;

// ===== DOM =====
const button1 = document.getElementById('button1');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const label1 = document.getElementById('label1');
const input1 = document.getElementById('name');
const button2 = document.getElementById('button2');
const finalScore = document.getElementById('finalScore');
const message = document.getElementById('message');
const highscoreList = document.getElementById('highscoreList');

// ===== INIT =====
init();

function init() {
  input1.style.display = 'none';
  label1.style.display = 'none';
  button2.style.display = 'none';
  loadHighscores();
}

// ===== EVENTS =====
button1.addEventListener('click', handleClick);
button2.addEventListener('click', submitHighScore);

// ===== GAME LOGIC =====
function handleClick() {
  if (gameState === "ended") return;

  if (gameState === "idle") {
    startGame();
  }

  increaseScore();
}

function startGame() {
  gameState = "playing";
  interval = setInterval(countdown, 1000);
}

function increaseScore() {
  score++;
  scoreDisplay.innerText = score;
}

function countdown() {
  timeLeft--;
  timerDisplay.innerText = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameState = "ended";
  clearInterval(interval);

  timerDisplay.innerText = 0;
  button1.style.display = 'none';

  input1.style.display = 'block';
  label1.style.display = 'block';
  button2.style.display = 'block';

  finalScore.style.display = 'block';
  finalScore.innerText = "Final Score: " + score;
}

// ===== HIGHSCORE SYSTEM =====

// Hämta från localStorage
function getHighscores() {
  try {
    return JSON.parse(localStorage.getItem("highscores")) || [];
  } catch {
    return [];
  }
}

// Spara till localStorage
function saveHighscores(scores) {
  localStorage.setItem("highscores", JSON.stringify(scores));
}

// Lägg till + sortera + begränsa
function addHighscore(name, score) {
  const scores = getHighscores();

  scores.push({ name, score });

  // Sortera högst först
  scores.sort((a, b) => b.score - a.score);

  // Behåll top 10
  const top10 = scores.slice(0, 10);

  saveHighscores(top10);
  renderHighscores(top10);
}

// Visa lista
function renderHighscores(scores) {
  highscoreList.innerHTML = "";

  scores.forEach((entry) => {
    const li = document.createElement("li");
    li.innerText = `${entry.name}: ${entry.score}`;
    highscoreList.appendChild(li);
  });
}

// Ladda vid start
function loadHighscores() {
  const scores = getHighscores();
  renderHighscores(scores);
}

// ===== SUBMIT =====
function submitHighScore() {
  const playerName = input1.value.trim();

  if (playerName.length < 3) {
    message.innerText = "Name must be at least 3 characters.";
    return;
  }

  try {
    addHighscore(playerName, score);
    message.innerText = "Score saved to leaderboard!";
  } catch (error) {
    message.innerText = "Something went wrong.";
    console.error(error);
  }
}
