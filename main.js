document.addEventListener("DOMContentLoaded", () => {
  createSquares();

  let guessedWords = [[]];
  let availableSpace = 1;

  const answer = "python";
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");
  const enterButton = document.getElementById("enter-button");
  const deleteButton = document.querySelector('[data-key="del"]');

  let enterClickCount = 0;
  const maxFakeClicks = 5;

  // Position enter near delete button (on load and on 5th click)
  function positionEnterNearDelete() {
    const delRect = deleteButton.getBoundingClientRect();
    enterButton.style.position = "fixed";
    enterButton.style.transition = "left 0.3s ease, top 0.3s ease";
    enterButton.style.left = `${delRect.left + 80}px`;
    enterButton.style.top = `${delRect.top}px`;
  }

  positionEnterNearDelete();

  function getCurrentWordArr() {
    return guessedWords[guessedWords.length - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr.length < 6) {
      currentWordArr.push(letter);
      const tile = document.getElementById(String(availableSpace));
      tile.textContent = letter;
      availableSpace++;
    }
  }

  function getTileColor(letter, index) {
    if (!answer.includes(letter)) return "rgb(58, 58, 60)";
    if (answer.charAt(index) === letter) return "rgb(83, 141, 78)";
    return "rgb(181, 159, 59)";
  }

  function revealTiles(currentWordArr) {
    const firstTileId = guessedWordCount * 6 + 1;
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const color = getTileColor(letter, index);
        const tile = document.getElementById(firstTileId + index);
        tile.classList.add("animate__flipInX");
        tile.style = `background-color:${color};border-color:${color}`;
      }, 200 * index);
    });
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 6) {
      alert("Word must be 6 letters");
      return false;
    }

    const currentWord = currentWordArr.join("").toLowerCase();
    revealTiles(currentWordArr);
    guessedWordCount++;

    if (currentWord === answer) {
      setTimeout(() => {
        alert("Congratulations!");
        window.location.href = "can.html";
      }, 1200);
      return true;
    } else {
      alert("Wrong answer!");
      guessedWords.push([]);
      return false;
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length === 0) return;

    currentWordArr.pop();
    const tile = document.getElementById(String(availableSpace - 1));
    tile.textContent = "";
    availableSpace--;
  }

  for (const key of keys) {
    key.onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      if (letter === "enter") return; // enter disabled until 6th click
      if (letter === "del") {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(letter);
    };
  }

  enterButton.addEventListener("click", () => {
    enterClickCount++;

    if (enterClickCount < maxFakeClicks) {
      // Move randomly on clicks 1 to 4
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = enterButton.getBoundingClientRect();
      const randomX = Math.floor(Math.random() * (vw - rect.width));
      const randomY = Math.floor(Math.random() * (vh - rect.height));

      enterButton.style.left = `${randomX}px`;
      enterButton.style.top = `${randomY}px`;
    } else if (enterClickCount === maxFakeClicks) {
      // On 5th click move near Delete button
      positionEnterNearDelete();
    } else if (enterClickCount === maxFakeClicks + 1) {
      // On 6th click validate word
      const isCorrect = handleSubmitWord();

      // Reset enter button click counter to start moving sequence again
      enterClickCount = 0;

      if (!isCorrect) {
        // If wrong, allow game to continue
        // No additional reset needed here
      }
    }
  });

  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let i = 0; i < 36; i++) {
      const square = document.createElement("div");
      square.classList.add("square", "animate__animated");
      square.setAttribute("id", i + 1);
      gameBoard.appendChild(square);
    }
  }
});
