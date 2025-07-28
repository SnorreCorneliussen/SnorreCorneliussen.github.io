
let users = JSON.parse(localStorage.getItem("mo2max_users") || "{}");
let currentUser = null;
let scores = [];
let games = ["tap", "emoji", "math", "reaction", "chair", "chug"];
let gameIndex = 0;

function createUser() {
  const name = document.getElementById("new-user").value.trim();
  if (name && !users[name]) {
    users[name] = [];
    localStorage.setItem("mo2max_users", JSON.stringify(users));
    populateUserSelect();
    document.getElementById("user-select").value = name;
  }
}

function populateUserSelect() {
  const select = document.getElementById("user-select");
  select.innerHTML = "";
  Object.keys(users).forEach(user => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = user;
    select.appendChild(option);
  });
}

function startTest() {
  currentUser = document.getElementById("user-select").value;
  if (!currentUser) return;
  games = shuffle([...games]);
  document.getElementById("user-section").style.display = "none";
  document.getElementById("game-section").style.display = "block";
  gameIndex = 0;
  scores = [];
  nextGame();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nextGame() {
  if (gameIndex >= games.length) {
    finishTest();
    return;
  }
  const game = games[gameIndex++];
  document.getElementById("game-title").textContent = game.toUpperCase();
  const content = document.getElementById("game-content");
  const button = document.getElementById("game-button");
  button.style.display = "none";

  if (game === "tap") {
    content.innerHTML = '<button id="tap-btn">Tap!</button><p id="tap-count">0</p>';
    let count = 0;
    const btn = document.getElementById("tap-btn");
    btn.onclick = () => {
      count++;
      document.getElementById("tap-count").textContent = count;
    };
    setTimeout(() => {
      btn.disabled = true;
      scores.push(Math.min(100, Math.floor(100 - count)));
      button.style.display = "inline-block";
    }, 5000);
  } else if (game === "emoji") {
    const emojis = ["🍕", "🐶", "🚀", "🎉", "🌈", "🍺"];
    const seq = shuffle(emojis).slice(0, 3);
    content.innerHTML = `<p>Memorize: ${seq.join(" ")}</p>`;
    setTimeout(() => {
      content.innerHTML = '<input id="emoji-input" placeholder="Enter emojis separated by space" />';
      button.onclick = () => {
        const input = document.getElementById("emoji-input").value.trim().split(" ");
        let correct = 0;
        for (let i = 0; i < 3; i++) {
          if (input[i] === seq[i]) correct++;
        }
        scores.push(Math.floor((3 - correct) * 33.3));
        nextGame();
      };
      button.textContent = "Submit";
      button.style.display = "inline-block";
    }, 3000);
  } else if (game === "math") {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    const answer = a + b;
    content.innerHTML = `<p>${a} + ${b} = ?</p><input id="math-input" type="number" />`;
    button.onclick = () => {
      const val = parseInt(document.getElementById("math-input").value);
      scores.push(val === answer ? 0 : 100);
      nextGame();
    };
    button.textContent = "Submit";
    button.style.display = "inline-block";
  } else if (game === "reaction") {
    content.innerHTML = "<p>Wait for it...</p>";
    setTimeout(() => {
      const start = Date.now();
      content.innerHTML = '<button id="react-btn">NOW!</button>';
      document.getElementById("react-btn").onclick = () => {
        const time = Date.now() - start;
        scores.push(Math.min(100, Math.floor(time / 10)));
        button.style.display = "inline-block";
      };
    }, 2000 + Math.random() * 3000);
  } else if (game === "chair") {
    content.innerHTML = '<p>Run around a chair and tap when done!</p><button id="chair-btn">Start</button>';
    document.getElementById("chair-btn").onclick = () => {
      const start = Date.now();
      content.innerHTML = '<button id="done-btn">Done!</button>';
      document.getElementById("done-btn").onclick = () => {
        const time = (Date.now() - start) / 1000;
        scores.push(Math.min(100, Math.floor(time * 10)));
        button.style.display = "inline-block";
      };
    };
  } else if (game === "chug") {
    content.innerHTML = '<img src="beer.png" width="100"/><p>Tap to start drinking, then tap again when done!</p><button id="chug-btn">Start</button>';
    document.getElementById("chug-btn").onclick = () => {
      const start = Date.now();
      content.innerHTML = '<img src="beer.png" width="100"/><button id="done-chug">Done!</button>';
      document.getElementById("done-chug").onclick = () => {
        const time = (Date.now() - start) / 1000;
        scores.push(Math.min(100, Math.floor(time * 5)));
        button.style.display = "inline-block";
      };
    };
  }
}

function finishTest() {
  const total = Math.min(100, Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length));
  users[currentUser].push(total);
  localStorage.setItem("mo2max_users", JSON.stringify(users));
  document.getElementById("game-section").style.display = "none";
  document.getElementById("result-section").style.display = "block";
  document.getElementById("final-score").textContent = `Your MO₂ Max Score: ${total}`;
  showLeaderboard();
  showHistory();
}

function showLeaderboard() {
  const board = [];
  for (const user in users) {
    const max = Math.max(...users[user]);
    board.push({ user, score: max });
  }
  board.sort((a, b) => b.score - a.score);
  const div = document.getElementById("leaderboard");
  div.innerHTML = "<h3>Leaderboard</h3><ol>" + board.map(e => `<li>${e.user} — ${e.score}</li>`).join("") + "</ol>";
}

function showHistory() {
  const div = document.getElementById("history");
  div.innerHTML = "<h3>Your History</h3><ul>" + users[currentUser].map(s => `<li>${s}</li>`).join("") + "</ul>";
}

populateUserSelect();
