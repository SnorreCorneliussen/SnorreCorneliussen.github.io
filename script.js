
let users = JSON.parse(localStorage.getItem("mo2max_users") || "{}");
let currentUser = null;
let scores = [];
let games = ["tap", "emoji", "math", "reaction", "chair", "twister", "color", "typing", "balance", "recall"];
let selectedGames = [];

function loadUsers() {
  const select = document.getElementById("user-select");
  select.innerHTML = "";
  Object.keys(users).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function createUser() {
  const name = document.getElementById("new-user").value;
  if (name && !users[name]) {
    users[name] = [];
    localStorage.setItem("mo2max_users", JSON.stringify(users));
    loadUsers();
    document.getElementById("user-select").value = name;
    currentUser = name;
    startTest();
  }
}

document.getElementById("user-select").addEventListener("change", () => {
  currentUser = document.getElementById("user-select").value;
  startTest();
});

function startTest() {
  document.getElementById("user-setup").style.display = "none";
  document.getElementById("game-area").style.display = "block";
  scores = [];
  selectedGames = shuffle(games).slice(0, 5);
  selectedGames.push("chug");
  currentGameIndex = 0;
  runGame(selectedGames[currentGameIndex]);
}

function shuffle(array) {
  let a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentGameIndex = 0;

function runGame(game) {
  const area = document.getElementById("game-content");
  area.innerHTML = `<p>Running game: ${game}</p>`;
}

function nextGame() {
  currentGameIndex++;
  if (currentGameIndex < selectedGames.length) {
    runGame(selectedGames[currentGameIndex]);
  } else {
    finishTest();
  }
}

function finishTest() {
  const score = Math.floor(Math.random() * 101);
  users[currentUser].push(score);
  localStorage.setItem("mo2max_users", JSON.stringify(users));
  document.getElementById("game-area").style.display = "none";
  document.getElementById("result-area").style.display = "block";
  document.getElementById("final-score").textContent = score;
  showLeaderboard();
}

function showLeaderboard() {
  const board = document.getElementById("leaderboard");
  const entries = Object.entries(users).map(([name, scores]) => {
    return { name, score: Math.max(...scores) };
  });
  entries.sort((a, b) => b.score - a.score);
  board.innerHTML = "<h3>Leaderboard</h3><ol>" + entries.map(e => `<li>${e.name}: ${e.score}</li>`).join("") + "</ol>";
}

window.onload = loadUsers;
