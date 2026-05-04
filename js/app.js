
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

// ===== HIGHSCORES =====
function getHighscores() {
  try {
    return JSON.parse(localStorage.getItem("highscores")) || [];
  } catch {
    return [];
  }
}

function saveHighscores(scores) {
  localStorage.setItem("highscores", JSON.stringify(scores));
}

function addHighscore(name, score) {
  const scores = getHighscores();

  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);

  const top10 = scores.slice(0, 10);

  saveHighscores(top10);
  renderHighscores(top10);
}

function renderHighscores(scores) {
  highscoreList.innerHTML = "";

  scores.forEach((entry) => {
    const li = document.createElement("li");
    li.innerText = `${entry.name}: ${entry.score}`;
    highscoreList.appendChild(li);
  });
}

function loadHighscores() {
  const scores = getHighscores();
  renderHighscores(scores);
}

// ===== SUBMIT + ZAPIER (FIXED) =====
async function submitHighScore() {
  const playerName = input1.value.trim();

  if (playerName.length < 3) {
    message.innerText = "Name must be at least 3 characters.";
    return;
  }

  try {
    // 1. Local save
    addHighscore(playerName, score);

    // 2. Send to Zapier (FIX: no-cors avoids Failed to fetch)
    fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: playerName,
        score: score
      })
    });

    message.innerText = "Score saved & sent!";

  } catch (error) {
    console.error("ERROR:", error);
    message.innerText = "Something went wrong: " + error.message;
  }
}
