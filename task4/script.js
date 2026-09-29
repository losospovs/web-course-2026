const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const checkBtn = document.getElementById("check-btn");
const newGameBtn = document.getElementById("new-game");
const alertBox = document.getElementById("alert");
const attemptsEl = document.getElementById("attempts");
const historyList = document.getElementById("history");

let secret = "";
let history = [];
let attempts = 0;
let finished = false;

function generateSecret() {
  const digits = [];
  while (digits.length < 4) {
    const d = Math.floor(Math.random() * 10);
    if (digits.indexOf(d) === -1) {
      digits.push(d);
    }
  }
  return digits.join("");
}

function validateGuess(value) {
  if (!/^\d{4}$/.test(value)) {
    return "Нужно ввести ровно 4 цифры";
  }
  const chars = value.split("");
  for (let i = 0; i < chars.length; i++) {
    for (let j = i + 1; j < chars.length; j++) {
      if (chars[i] === chars[j]) {
        return "Цифры не должны повторяться";
      }
    }
  }
  return "";
}

function countBullsAndCows(guess, secretValue) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < guess.length; i++) {
    const digit = guess[i];
    if (digit === secretValue[i]) {
      bulls++;
    } else if (secretValue.indexOf(digit) !== -1) {
      cows++;
    }
  }

  return { bulls: bulls, cows: cows };
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function formatResult(bulls, cows) {
  const bullWord = pluralize(bulls, "бык", "быка", "быков");
  const cowWord = pluralize(cows, "корова", "коровы", "коров");
  return bulls + " " + bullWord + ", " + cows + " " + cowWord;
}

function showAlert(message, isWin) {
  alertBox.textContent = message;
  if (isWin) {
    alertBox.classList.add("alert--win");
  } else {
    alertBox.classList.remove("alert--win");
  }
}

function updateAttempts() {
  attemptsEl.textContent = attempts;
}

function createHistoryItem(entry) {
  const li = document.createElement("li");
  li.className = "history__item";

  const guessSpan = document.createElement("span");
  guessSpan.className = "history__guess";
  guessSpan.textContent = entry.guess;

  const resultSpan = document.createElement("span");
  resultSpan.className = "history__result";
  if (entry.bulls === 4) {
    resultSpan.classList.add("history__result--win");
  }
  resultSpan.textContent = formatResult(entry.bulls, entry.cows);

  li.appendChild(guessSpan);
  li.appendChild(resultSpan);
  return li;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history__empty";
    empty.textContent = "Пока нет попыток";
    historyList.appendChild(empty);
    return;
  }

  history.forEach(function (entry) {
    historyList.appendChild(createHistoryItem(entry));
  });
}

function lockGame() {
  finished = true;
  input.disabled = true;
  checkBtn.disabled = true;
}

function unlockGame() {
  finished = false;
  input.disabled = false;
  checkBtn.disabled = false;
  input.focus();
}

function startNewGame() {
  secret = generateSecret();
  history = [];
  attempts = 0;
  finished = false;

  showAlert("");
  updateAttempts();
  renderHistory();

  input.value = "";
  unlockGame();

  console.log("Загадано (для отладки):", secret);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (finished) {
    return;
  }

  const value = input.value.trim();
  const error = validateGuess(value);

  if (error) {
    showAlert(error);
    return;
  }

  showAlert("");

  const result = countBullsAndCows(value, secret);

  attempts++;
  history.push({
    guess: value,
    bulls: result.bulls,
    cows: result.cows
  });

  updateAttempts();
  renderHistory();

  input.value = "";
  input.focus();

    if (result.bulls === 4) {
    showAlert(
      "Победа! Угадано за " + attempts + " " +
      pluralize(attempts, "попытку", "попытки", "попыток"),
      true
    );
    lockGame();
  }
});
newGameBtn.addEventListener("click", function () {
  startNewGame();
});

startNewGame();