//Váltás gyakorló és verseny mód között
function changeMode() {
  gameSettings.mode = !gameSettings.mode;
  gameSettings.mode
    ? (menuElements.modeButton.innerText = "Verseny")
    : (menuElements.modeButton.innerText = "Gyakorló");
  menuElements.settingsButton.classList.toggle("disabled");
}

//Játékoslista kiszürkítése
function resetPlayerList() {
  let i = 0;
  for (elem of menuElements.playerList) {
    for (color of playerColors.slice(1, 12)) {
      elem.classList.remove(color);
    }
    elem.classList.add("grey");
    i++;
    elem.contentEditable = "false";
  }
}

//Játékoslista beállítása
function changePlayers() {
  //Gombon lévő érték növelése
  if (menuElements.playerCountButton.innerText < 10) {
    menuElements.playerCountButton.innerText++;
  } else {
    menuElements.playerCountButton.innerText = 1;
  }
  let playerCount = parseInt(menuElements.playerCountButton.innerText);

  //Játékoslista kiszínezése, szerkeszthetővé tétele
  let i = 0;
  resetPlayerList();

  while (i < playerCount) {
    menuElements.playerList[i].classList.remove("grey");
    menuElements.playerList[i].classList.add(playerColors[i + 1]);
    menuElements.playerList[i].contentEditable = "true";
    i++;
  }

  //A szürke elemeknek a listában mindig default JátékosN neve legyen
  while (i >= playerCount && i < menuElements.playerList.length) {
    menuElements.playerList[i].innerText = `Játékos${i + 1}`;
    i++;
  }
}

//Menü képernyő betöltése
function loadMenu() {
  //Menü állapot beállítása
  if (currentState) hideState(currentState);
  currentState = states.mainMenu;
  showState(states.mainMenu);

  //Default értékek beállítása
  loadDifficultySlider(); // ./slidercheckbox.js
  menuElements.playerCountButton.innerText = 0;
  resetPlayerList();
  changePlayers();

  //Toplista kiírása
  displayToplist(toplists.beginner);

  //Menü gombok eseménykezelése
  menuElements.modeButton.addEventListener("click", changeMode);
  menuElements.playerCountButton.addEventListener("click", changePlayers);
  menuElements.settingsButton.addEventListener("click", loadOptions);
  menuElements.startButton.addEventListener("click", startGame);
  menuElements.rulesButton.addEventListener("click", (e) => {
    hideState(currentState);
    showState(states.tutorial);
  });
  menuElements.tutorialExit.addEventListener("click", (e) => {
    hideState(currentState);
    showState(states.mainMenu);
  });

  //Sortörés megakadályozása játékosnév megadásánál
  document.getElementById("player-list").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  });

  //Max karakter meghatározása a játékosneveknél
  delegal(
    document.getElementById("player-list"),
    ".player-list-element",
    "keypress",
    (e) => {
      if (!isThereEmptyPlayerName()) {
        menuElements.startButton.classList.remove("disabled");
      }
      if (e.target.innerText.length >= 9 && e.key != "Backspace") {
        e.preventDefault();
      }
    }
  );

  //Ha van üres név, a start gomb legyen disabled
  delegal(
    document.getElementById("player-list"),
    ".player-list-element:not(.grey)",
    "keyup",
    (e) => {
      if (isThereEmptyPlayerName()) {
        menuElements.startButton.classList.add("disabled");
      } else {
        menuElements.startButton.classList.remove("disabled");
      }
    }
  );

  //Játékosnévre kattintáskor ürüljön ki
  delegal(
    document.getElementById("player-list"),
    ".player-list-element:not(.grey)",
    "click",
    (e) => {
      menuElements.startButton.classList.add("disabled");
      e.target.innerText = "";
    }
  );
}

//Toplisták betöltése
function displayToplist(toplist) {
  let i = 0;
  for (elem of toplist) {
    menuElements.toplist[
      i
    ].innerHTML = `<td>${elem.name}</td><td>${elem.time}mp</td>`;
    i++;
  }
  for (i; i < menuElements.toplist.length; i++) {
    menuElements.toplist[i].innerHTML = "<td colspan='2'>~üres~</td>";
  }
}

//Egyéb beállítások képernyő betöltése
function loadOptions() {
  hideState(currentState);
  showState(states.options);
  loadOptionsSliders();
  delegal(
    document.getElementById("extra-options"),
    'input[type="checkbox"]',
    "click",
    loadOptionsSliders
  );

  //Vissza gomb
  optionsElements.backButton.addEventListener("click", () => {
    hideState(states.options);
    showState(states.mainMenu);
  });
}

//Annak vizsgálata, hogy van-e üres játékosnév
function isThereEmptyPlayerName() {
  for (player of document.querySelectorAll(".player-list-element:not(.grey)")) {
    if (player.innerText.trim() == "") {
      return true;
    }
  }

  return false;
}

menuElements.topListHeader.addEventListener("click", (e) => {
  if (activeToplist == 1) {
    e.target.innerText = topListTitles[activeToplist];
    activeToplist = 0;
    displayToplist(toplists.advanced);
  } else {
    e.target.innerText = topListTitles[activeToplist];
    activeToplist = 1;
    displayToplist(toplists.beginner);
  }
});
