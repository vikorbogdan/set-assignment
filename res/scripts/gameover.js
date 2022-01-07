//Game over képernyő megjelenítése
function showEndScreen() {
  //State beállítása
  hideState(currentState);
  showState(states.gameOver);

  //Játékos scoreboard kiírása
  let scoreboardData = [];
  for (elem of endGameData.playerDatas) {
    if (!elem.name == "") {
      scoreboardData.push(elem);
    }
  }

  if (scoreboardData.length > 1) {
    scoreboardData.sort((a, b) => (a.score < b.score ? 1 : -1));

    gameOverElements.scoreboard.innerHTML = "";
    let cell, row;
    counter = 0;
    for (data of scoreboardData) {
      row = document.createElement("tr");
      cell = document.createElement("td");
      cell.innerHTML = data.name;
      row.appendChild(cell);
      cell = document.createElement("td");
      cell.innerHTML = data.score;
      row.appendChild(cell);
      for (color in primaryColors) {
        counter++;
        if (counter == data.id + 1) {
          row.style.color = primaryColors[color];
        }
      }
      counter = 0;
      gameOverElements.scoreboard.appendChild(row);
    }
  } else {
    gameOverElements.tableContainer.style.display = "none";
    gameOverElements.spentTime.style.display = "block";
    gameOverElements.spentTime.classList.remove("spent-time-text");
    gameOverElements.spentTime.classList.add("spent-time-oneplayer");
    gameOverElements.resultsHeader.style.display = "none";
    document.getElementById("endscreen-buttons").style.marginTop = "240px";
  }
  //Eltelt idő kiírása
  gameOverElements.spentTime.innerText = `${new Date(
    endGameData.gameTime * 1000
  )
    .toISOString()
    .substr(14, 5)}`;

  //Eseménykezelés a gombokhoz
  addResetButtonEvents();

  //Toplistába tárolás
  if (endGameData.gameMode) {
    if (scoreboardData.length == 1) {
      if (!endGameData.gameDifficulty) {
        //kezdő mód
        if (toplists.beginner.length == 10) {
          for (elem of toplists.beginner) {
            if (elem.time > endGameData.gameTime) {
              toplists.beginner.splice(toplists.beginner.indexOf(elem), 0, {
                name: scoreboardData[0].name,
                time: endGameData.gameTime,
              });
              toplists.beginner.pop();
              toplists.beginner.sort((a, b) => (a.time > b.time ? 1 : -1));
              localData.setItem("toplists", JSON.stringify(toplists));
              return;
            }
          }
        } else if (toplists.beginner.length < 10) {
          for (elem of toplists.beginner) {
            if (elem.time > endGameData.gameTime) {
              toplists.beginner.splice(toplists.beginner.indexOf(elem), 0, {
                name: scoreboardData[0].name,
                time: endGameData.gameTime,
              });
              toplists.beginner.sort((a, b) => (a.time > b.time ? 1 : -1));
              localData.setItem("toplists", JSON.stringify(toplists));
              return;
            }
          }
          toplists.beginner.push({
            name: scoreboardData[0].name,
            time: endGameData.gameTime,
          });
        }
        toplists.beginner.sort((a, b) => (a.time > b.time ? 1 : -1));
      } else {
        //haladó mód
        if (toplists.advanced.length == 10) {
          for (elem of toplists.advanced) {
            if (elem.time > endGameData.gameTime) {
              toplists.advanced.splice(toplists.advanced.indexOf(elem), 0, {
                name: scoreboardData[0].name,
                time: endGameData.gameTime,
              });
              toplists.advanced.pop();
              toplists.advanced.sort((a, b) => (a.time > b.time ? 1 : -1));
              localData.setItem("toplists", JSON.stringify(toplists));
              return;
            }
          }
        } else if (toplists.advanced.length < 10) {
          for (elem of toplists.advanced) {
            if (elem.time > endGameData.gameTime) {
              toplists.advanced.splice(toplists.advanced.indexOf(elem), 0, {
                name: scoreboardData[0].name,
                time: endGameData.gameTime,
              });
              toplists.advanced.sort((a, b) => (a.time > b.time ? 1 : -1));
              localData.setItem("toplists", JSON.stringify(toplists));
              return;
            }
          }
          toplists.advanced.push({
            name: scoreboardData[0].name,
            time: endGameData.gameTime,
          });
        }
        toplists.advanced.sort((a, b) => (a.time > b.time ? 1 : -1));
      }
      localData.setItem("toplists", JSON.stringify(toplists));
    }
  }
}

//Eseménykezelés a gombokhoz
function addResetButtonEvents() {
  gameOverElements.menuButton.addEventListener(
    "click",
    window.location.reload.bind(window.location)
  );
  gameOverElements.restartButton.addEventListener("click", startGame);
}
