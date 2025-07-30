
let playerName = "";
let score = 0;
let subgameIndex = 0;
let subgames = ["reaction", "coordination", "memory", "balance", "focus"];
let subgameScores = [];

function startGame() {
    playerName = document.getElementById("player-name").value;
    if (playerName.trim() === "") return;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("good-luck-screen").style.display = "flex";
}

function startSubgames() {
    document.getElementById("good-luck-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    subgames = shuffleArray(subgames);
    subgameIndex = 0;
    score = 0;
    subgameScores = [];
    loadSubgame();
}

function loadSubgame() {
    if (subgameIndex >= subgames.length) {
        showFinalScore();
        return;
    }
    const container = document.getElementById("subgame-container");
    container.innerHTML = "";
    const game = subgames[subgameIndex];
    if (game === "reaction") {
        loadReactionGame(container);
    } else if (game === "coordination") {
        loadCoordinationGame(container);
    } else if (game === "memory") {
        loadMemoryGame(container);
    } else if (game === "balance") {
        loadBalanceGame(container);
    } else if (game === "focus") {
        loadFocusGame(container);
    }
}

function loadReactionGame(container) {
    container.innerHTML = "<h3>Reaction Test</h3><p>Click when the box turns green</p>";
    const box = document.createElement("div");
    box.style.width = "100px";
    box.style.height = "100px";
    box.style.backgroundColor = "red";
    box.style.margin = "20px auto";
    container.appendChild(box);
    let startTime;
    setTimeout(() => {
        box.style.backgroundColor = "green";
        startTime = Date.now();
    }, Math.random() * 3000 + 2000);
    box.onclick = () => {
        if (!startTime) return;
        const reactionTime = Date.now() - startTime;
        let gameScore = Math.min(20, Math.floor(reactionTime / 50));
        subgameScores.push(gameScore);
        subgameIndex++;
        loadSubgame();
    };
}

function loadCoordinationGame(container) {
    container.innerHTML = "<h3>Coordination Test</h3><p>Click the moving target</p>";
    const target = document.createElement("div");
    target.style.width = "50px";
    target.style.height = "50px";
    target.style.backgroundColor = "yellow";
    target.style.position = "absolute";
    target.style.top = "50%";
    target.style.left = "50%";
    document.body.appendChild(target);
    let hits = 0;
    target.onclick = () => hits++;
    const interval = setInterval(() => {
        target.style.top = Math.random() * 80 + "%";
        target.style.left = Math.random() * 80 + "%";
    }, 500);
    setTimeout(() => {
        clearInterval(interval);
        document.body.removeChild(target);
        let gameScore = Math.max(0, 20 - hits);
        subgameScores.push(gameScore);
        subgameIndex++;
        loadSubgame();
    }, 10000);
}

function loadMemoryGame(container) {
    container.innerHTML = "<h3>Memory Test</h3><p>Memorize the number sequence</p>";
    const sequence = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join("");
    const seqDisplay = document.createElement("p");
    seqDisplay.textContent = sequence;
    container.appendChild(seqDisplay);
    setTimeout(() => {
        container.innerHTML = "<h3>Memory Test</h3><p>Enter the sequence</p>";
        const input = document.createElement("input");
        container.appendChild(input);
        const button = document.createElement("button");
        button.textContent = "Submit";
        container.appendChild(button);
        button.onclick = () => {
            let gameScore = input.value === sequence ? 0 : 20;
            subgameScores.push(gameScore);
            subgameIndex++;
            loadSubgame();
        };
    }, 3000);
}

function loadBalanceGame(container) {
    container.innerHTML = "<h3>Balance Test</h3><p>Keep the dot centered</p>";
    const dot = document.createElement("div");
    dot.style.width = "30px";
    dot.style.height = "30px";
    dot.style.backgroundColor = "blue";
    dot.style.borderRadius = "50%";
    dot.style.position = "absolute";
    dot.style.top = "50%";
    dot.style.left = "50%";
    document.body.appendChild(dot);
    let movement = 0;
    const interval = setInterval(() => {
        const dx = Math.random() * 20 - 10;
        const dy = Math.random() * 20 - 10;
        dot.style.top = `calc(${dot.style.top} + ${dy}px)`;
        dot.style.left = `calc(${dot.style.left} + ${dx}px)`;
        movement += Math.abs(dx) + Math.abs(dy);
    }, 500);
    setTimeout(() => {
        clearInterval(interval);
        document.body.removeChild(dot);
        let gameScore = Math.min(20, Math.floor(movement / 100));
        subgameScores.push(gameScore);
        subgameIndex++;
        loadSubgame();
    }, 5000);
}

function loadFocusGame(container) {
    container.innerHTML = "<h3>Focus Test</h3><p>Click only blue squares</p>";
    let score = 0;
    for (let i = 0; i < 20; i++) {
        const square = document.createElement("div");
        square.style.width = "50px";
        square.style.height = "50px";
        square.style.display = "inline-block";
        square.style.margin = "5px";
        const isBlue = Math.random() > 0.5;
        square.style.backgroundColor = isBlue ? "blue" : "red";
        square.onclick = () => {
            score += isBlue ? 0 : 1;
            square.style.visibility = "hidden";
        };
        container.appendChild(square);
    }
    const button = document.createElement("button");
    button.textContent = "Finish";
    container.appendChild(button);
    button.onclick = () => {
        let gameScore = Math.min(20, score);
        subgameScores.push(gameScore);
        subgameIndex++;
        loadSubgame();
    };
}

function showFinalScore() {
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("final-screen").style.display = "flex";
    const totalScore = subgameScores.reduce((a, b) => a + b, 0);
    document.getElementById("final-score").textContent = `${playerName}, your MO2 Max is: ${totalScore}`;
    document.getElementById("final-sound").play();
    updateLeaderboard(playerName, totalScore);
}

function updateLeaderboard(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push({name, score});
    leaderboard.sort((a, b) => a.score - b.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    const list = document.getElementById("leaderboard");
    list.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}` + (index === 0 ? " - All Mongo (MO2) MAXED OUT" : "");
        list.appendChild(li);
    });
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
