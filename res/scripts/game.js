//Játék elindítása
function startGame() {
  //State beállítása
  hideState(currentState);
  showState(states.loadingScreen);

  //Alapértékek megadása a játékban használatos változókhoz
  gameSettings.players = [];
  inGameData = {
    playerData: new Array(),
    activePlayer: null,
    selectedCardsCount: 0,
    selectedCards: [],
    selectedCardContents: [],
    activePlayerTimer: null,
    blockedPlayers: new Array(),
    timeSpent: 0,
    setToShow: new Array(),
    gameEnded: false,
    threeWasAdded: false,
    colCount: 4,
  };
  setGame.dealtCards = [[], [], []];
  setGame.deck.content = [];
  for (card of gameScreenElements.cards) {
    card.innerHTML = "";
  }
  gameScreenElements.textContent.innerText = "";

  //Játékosok eltárolása
  let players = document.querySelectorAll(".player-list-element:not(.grey)");
  for (player of players) {
    content = player.innerText;
    gameSettings.players.push(content.replace(/(\r\n|\n|\r)/gm, ""));
  }

  //Ha a játékosok száma 1, akkor egyjátékos módban fusson
  if (players.length == 1) {
    gameSettings.onePlayerMode = true;
  } else {
    gameSettings.onePlayerMode = false;
  }

  //Ha verseny mód, akkor nincsenek segítségek
  if (gameSettings.mode) {
    gameSettings.activeButtons = [false, true, false];
  }
  let i = 0;
  for (button of gameScreenElements.helpButtons) {
    button.classList.remove("ingame-button");
    button.classList.remove("ingame-button-disabled");
    if (gameSettings.activeButtons[i]) {
      button.classList.add("ingame-button");
      addButtonEvents(button);
    } else {
      button.classList.add("ingame-button-disabled");
    }
    i++;
  }

  //Játékoslista betöltése
  loadInGamePlayerList();

  //Pakli előkészítése
  deckSetup(gameSettings.difficulty);

  //Játékképernyő megjelenítése
  hideState(currentState);
  showState(states.gameScreen);

  //Kártyák leosztása
  dealCards(gameSettings.difficulty);

  //Játékosok kijelölhetősége
  if (!gameSettings.onePlayerMode) {
    delegal(
      gameScreenElements.inGamePlayerList,
      "#ingame-player-list ul li",
      "click",
      (e) => {
        selectPlayer(e.target);
      }
    );
  } else {
    inGameData.activePlayer = inGameData.playerData[0];
  }

  //Időzítő
  timer = setInterval(() => {
    inGameData.timeSpent++;

    gameScreenElements.timeDisplay.innerText = `${new Date(
      inGameData.timeSpent * 1000
    )
      .toISOString()
      .substr(14, 5)}`;
  }, 1000);

  //Oszlopszám eltárolása
  inGameData.colCount = 4;

  //Pakli méretének frissítése a dokumentumon belül
  gameScreenElements.deckSizeDisplay.innerText = String(
    setGame.deck.content.length
  ).padStart(2, "0");
}

//Játék vége
function endGame() {}

//SVG(-k) kirajzolása egy lapra
function drawOut(place, card) {
  place.innerHTML = "";
  place.classList.remove("ingame-card-placeholder");
  place.classList.add("ingame-card");
  addCardEvents(place);
  let cardContent = document.createElement("div");
  let colorToDrawOut;
  if (card) {
    if (card.color == "green") {
      colorToDrawOut = [setColors.green, "green"];
    } else if (card.color == "red") {
      colorToDrawOut = [setColors.red, "red"];
    } else {
      colorToDrawOut = [setColors.blue, "blue"];
    }

    for (let i = 0; i < card.count; i++) {
      let shape = svgShapes[card.shape].cloneNode(true);
      shape.setAttribute("width", "55px");
      shape.setAttribute("height", "27.5px");
      shape.childNodes[3].style.display = "inline-block";
      //Szín beállítása
      shape.childNodes[3].style.fill = colorToDrawOut[0];
      shape.childNodes[3].style.stroke = colorToDrawOut[0];
      //Kitöltés beállítása
      if (gameSettings.difficulty) {
        if (card.fill == "striped") {
          shape.childNodes[3].style.fill = `url(#${colorToDrawOut[1]}-pattern)`;
        } else if (card.fill == "empty") {
          shape.childNodes[3].style.fill = "none";
        }
      }
      cardContent.classList.add("card-content");
      cardContent.appendChild(shape);
    }
  } else {
    cardContent.innerHTML = "";
  }
  place.appendChild(cardContent);
  place.classList.remove("show-set");
}

//Játékoslista betöltése a Játékképernyőn
function loadInGamePlayerList() {
  //Egyjátékos módban legyen vastag a játékos neve
  if (gameSettings.players.length === 1) {
    gameScreenElements.inGamePlayerListElements[0].style.fontWeight = "800";
  }

  let i = 0;
  //classListek kiürítése
  for (elem of gameSettings.players) {
    for (color of playerColors) {
      gameScreenElements.playerListCircles[i].classList.remove(color);
    }

    //Színes classListek hozzárendelése
    gameScreenElements.playerListCircles[i].classList.add(playerColors[i + 1]);
    gameScreenElements.playerListNames[i].innerText = gameSettings.players[i];
    gameScreenElements.playerListCircles[i].innerText = 0;
    i++;
  }

  //A nem használt sorok kiszürkítése
  while (i < gameScreenElements.inGamePlayerListElements.length) {
    gameScreenElements.playerListNames[i].innerText = "";
    gameScreenElements.playerListCircles[i].innerText = "";
    for (color of playerColors) {
      gameScreenElements.playerListCircles[i].classList.remove(color);
    }
    gameScreenElements.playerListCircles[i].classList.add("grey");
    i++;
  }

  let ID_COUNTER = 0;
  //Játékosok eltárolása
  for (jatekos of gameScreenElements.playerListNames) {
    jatekos.parentElement.id = ID_COUNTER;
    inGameData.playerData.push({
      name: `${jatekos.innerText}`,
      score: 0,
      id: ID_COUNTER++,
    });
  }
}

//Pontok hozzáadása a SET-et találó játékoshoz ha value false akkor negatív értéket ad hozzá
function addPlayerPoints(player, value) {
  //Pontok hozzáadása a player objektumhoz
  let i = 0;
  if (value) {
    for (data of inGameData.playerData) {
      if (inGameData.playerData[i].id == player.id) {
        inGameData.playerData[i].score++;
      }
      i++;
    }
  } else {
    for (data of inGameData.playerData) {
      if (inGameData.playerData[i].id == player.id) {
        inGameData.playerData[i].score--;
      }
      i++;
    }
  }

  //Játékoslista újrarajzolása
  let j = 0;
  for (elem of gameScreenElements.playerListCircles) {
    if (!elem.classList.contains("grey"))
      elem.innerText = inGameData.playerData[j].score;
    j++;
  }
}

//Paraméterként átadott játékos aktívvá tétele 10 másodpercre / amíg nem választ ki három lapot
function selectPlayer(player) {
  if (player.nodeName == "SPAN") {
    player = player.parentElement;
  }
  for (let i = 0; i < inGameData.playerData.length; i++) {
    if (
      player.id == inGameData.playerData[i].id &&
      inGameData.playerData[i].name != "" &&
      !inGameData.activePlayer &&
      !inGameData.blockedPlayers.includes(inGameData.playerData[i])
    ) {
      inGameData.activePlayer = inGameData.playerData[i];
      player.classList.add("selected-player");

      //10mp időzítő
      inGameData.activePlayerTimer = setTimeout(() => {
        player.classList.remove("selected-player");
        inGameData.activePlayer = null;
        gameScreenElements.textContent.innerText = "Választási idő letelt";
      }, 10000);
    }
  }
}

//Három kártyát tartalmazó Array paraméterkénti átadásával eldönti róluk, hogy SET-et alkotnak-e
function checkIfSet(cardList) {
  //fill csak hard módban
  let shapesAllSame, colorsAllSame, countsAllSame, fillAllSame;
  let shapesAllDiff, colorsAllDiff, countsAllDiff, fillAllDiff;
  let shapes = [],
    colors = [],
    counts = [],
    fills = [];
  for (card of cardList) {
    if (card) {
      shapes.push(card.shape);
      colors.push(card.color);
      counts.push(card.count);
      if (gameSettings.difficulty) fills.push(card.fill);
    }
  }
  shapesAllSame = shapes[0] == shapes[1] && shapes[1] == shapes[2];
  colorsAllSame = colors[0] == colors[1] && colors[1] == colors[2];
  countsAllSame = counts[0] == counts[1] && counts[1] == counts[2];

  shapesAllDiff = new Set(shapes).size == shapes.length;
  colorsAllDiff = new Set(colors).size == colors.length;
  countsAllDiff = new Set(counts).size == counts.length;

  if (gameSettings.difficulty) {
    fillsAllSame = fills[0] == fills[1] && fills[1] == fills[2];
    fillsAllDiff = new Set(fills).size == fills.length;
  }

  let allSames = gameSettings.difficulty
    ? [shapesAllSame, colorsAllSame, countsAllSame, fillsAllSame]
    : [shapesAllSame, colorsAllSame, countsAllSame];
  let allDiffs = gameSettings.difficulty
    ? [shapesAllDiff, colorsAllDiff, countsAllDiff, fillsAllDiff]
    : [shapesAllDiff, colorsAllDiff, countsAllDiff];
  let isSet = gameSettings.difficulty
    ? (allSames[0] || allDiffs[0]) &&
      (allSames[1] || allDiffs[1]) &&
      (allSames[2] || allDiffs[2]) &&
      (allSames[3] || allDiffs[3])
    : (allSames[0] || allDiffs[0]) &&
      (allSames[1] || allDiffs[1]) &&
      (allSames[2] || allDiffs[2]);

  return isSet;
}

//Ez történjen, miután kiválasztottunk három lapot a lent lévő lapok közül
async function checkIfThreeSelected() {
  if (inGameData.selectedCardsCount == 3) {
    //A három választott kártya tulajdonságainak(szín,forma,stb..) eltárolása objektumként
    for (selectedCard of inGameData.selectedCards) {
      for (row of setGame.dealtCards) {
        for (elem of row) {
          if (document.getElementById(elem.element) == selectedCard) {
            inGameData.selectedCardContents.push(elem.content);
          }
        }
      }
    }

    if (checkIfSet(inGameData.selectedCardContents)) {
      //HA SET

      //Blokkolt játékosok aktívvá tétele
      inGameData.blockedPlayers = [];
      for (elem of gameScreenElements.inGamePlayerListElements) {
        elem.classList.remove("blocked-player");
      }

      //Set! kiírása
      gameScreenElements.textContent.innerText = "Set!";

      //Kártyákon lévő kijelölés megszüntetése
      for (card of inGameData.selectedCards) {
        card.classList.remove("clicked");
      }

      //Zöld felvillanás a korábban kijelölt kártyákon
      inGameData.selectedCards[0].classList.add("set");
      inGameData.selectedCards[1].classList.add("set");
      inGameData.selectedCards[2].classList.add("set");
      await sleep(1000);
      inGameData.selectedCards[0].classList.remove("set");
      inGameData.selectedCards[1].classList.remove("set");
      inGameData.selectedCards[2].classList.remove("set");

      //Pont hozzáadása a kijelölt játékoshoz, kijelölés megszüntetése (többjátékos mód esetén)
      addPlayerPoints(inGameData.activePlayer, true);
      if (!gameSettings.onePlayerMode) {
        inGameData.activePlayer = null;
        for (elem of gameScreenElements.inGamePlayerListElements) {
          elem.classList.remove("selected-player");
        }
        clearTimeout(inGameData.activePlayerTimer);
      }

      //A setben lévő kártyák indexeinek tárolása
      cardIndexes = [[], [], []];
      let i = 0,
        j = 0,
        c = 0;
      for (row of setGame.dealtCards) {
        i++;
        for (card of row) {
          j++;
          for (selectedCard of inGameData.selectedCards) {
            if (selectedCard == document.getElementById(card.element)) {
              cardIndexes[c][0] = i;
              cardIndexes[c][1] = j;
              c++;
            }
          }
        }
        j = 0;
      }

      //A setben lévő kártyák indexein kicserélni a kártyát három másikra a pakliból (amíg van pakli)
      if (setGame.deck.content.length > 0) {
        //Ha a plusz három lap hozzá volt adva, tehát 5x3-as a pálya, akkor ne pótoljon a pakliból
        if (inGameData.threeWasAdded) {
          //SET kártyák eltávolítása a modellből
          for (cardIndex of cardIndexes) {
            for (row of setGame.dealtCards) {
              for (let i = row.length - 1; i >= 0; i--) {
                if (row[i].element == `card-${cardIndex[0]}-${cardIndex[1]}`) {
                  row.splice(i, 1);
                }
              }
            }
          }

          //Maradék kártyák összeszedése egy arraybe
          let arrayOfCards = new Array();
          let rowCounter = 0;
          let r1 = 1,
            r2 = 1,
            r3 = 1;
          for (row of setGame.dealtCards) {
            for (elem of row) {
              if (rowCounter < 4) {
                arrayOfCards.push({
                  element: `card-1-${r1}`,
                  content: elem.content,
                });
                r1++;
              } else if (rowCounter < 8) {
                arrayOfCards.push({
                  element: `card-2-${r2}`,
                  content: elem.content,
                });
                r2++;
              } else {
                arrayOfCards.push({
                  element: `card-3-${r3}`,
                  content: elem.content,
                });
                r3++;
              }
              rowCounter++;
            }
          }

          //A lent lévő kártyák kitörlése a modellből
          setGame.dealtCards = [[], [], []];

          //A kirenderelt lapok ürítése a dokumentumból
          let c = 1;
          for (cardPlace of document.querySelectorAll(".ingame-card")) {
            cardPlace.innerHTML = "";
            if (c % 5 == 0) {
              cardPlace.classList.remove("ingame-card");
              cardPlace.classList.add("ingame-card-placeholder");
            }
            c++;
          }

          //A felszedett kártyák újraosztása 4x3 alakzatba az arrayből a mátrix jellegű modellbe, majd ezek kirajzolása
          for (elem of arrayOfCards) {
          }
          let counter = 0;
          for (card of arrayOfCards) {
            if (counter < 4) {
              setGame.dealtCards[0].push({
                element: card.element,
                content: card.content,
              });
            } else if (counter < 8) {
              setGame.dealtCards[1].push({
                element: card.element,
                content: card.content,
              });
            } else {
              setGame.dealtCards[2].push({
                element: card.element,
                content: card.content,
              });
            }
            counter++;
            drawOut(document.getElementById(card.element), card.content);
          }

          //Oszlopszám csökkentése 4-re
          inGameData.colCount = 4;

          //Plusz három kártya el lett véve, ezért ezt az állapotot veszi fel a változó
          inGameData.threeWasAdded = false;

          //Ha ezek után már nincs lent SET, és a pakli is üres, akkor vége a játéknak (nagyon kicsi esély van erre)
          if (!isThereSet() && setGame.deck.content.length < 3) {
            //Játék vége
            inGameData.gameEnded = true;
            endGameData.gameDifficulty = gameSettings.difficulty;
            endGameData.gameMode = gameSettings.mode;
            endGameData.gameTime = inGameData.timeSpent;
            for (player of inGameData.playerData) {
              endGameData.playerDatas.push(player);
            }
            showEndScreen();
          }
        } else {
          //Set kiválasztása esetén, ha nem lettek plusz lapok korábban hozzáadva, és még van pakli
          //SET elemek helyettesítése a pakliból
          for (i of cardIndexes) {
            setGame.dealtCards[i[0] - 1][i[1] - 1] = {
              element: `card-${i[0]}-${i[1]}`,
              content: setGame.deck.content.pop(),
            };
            drawOut(
              document.getElementById(`card-${i[0]}-${i[1]}`),
              setGame.dealtCards[i[0] - 1][i[1] - 1].content
            );
          }
        }

        //Ha be van állítva az automatikus laphozzáadás, és nincs lent SET akkor egészítse ki a 4x3-as mezőt 5x3-ra,
        //feltéve hogy van még a pakliban lap
        if (
          !isThereSet() &&
          setGame.deck.content.length >= 3 &&
          !gameSettings.activeButtons[1]
        ) {
          plusThreeCards();
          gameScreenElements.textContent.innerText = "3 lap hozzáadva";
        }
      } else {
        //Ha a pakliban már nincsenek lapok, vegye el a SET-et, és rendezze át a pályát 5->4->3->2->1 oszloposra

        //SET kitörlése
        inGameData.colCount--;
        for (cardIndex of cardIndexes) {
          for (row of setGame.dealtCards) {
            for (let i = row.length - 1; i >= 0; i--) {
              if (row[i].element == `card-${cardIndex[0]}-${cardIndex[1]}`) {
                row.splice(i, 1);
              }
            }
          }
        }

        //Kártyák összeszedése egy arraybe
        let arrayOfCards = new Array();
        let rowCounter = 0;
        let r1 = 1,
          r2 = 1,
          r3 = 1;
        for (row of setGame.dealtCards) {
          for (elem of row) {
            if (rowCounter < inGameData.colCount * 1) {
              arrayOfCards.push({
                element: `card-1-${r1}`,
                content: elem.content,
              });
              r1++;
            } else if (rowCounter < inGameData.colCount * 2) {
              arrayOfCards.push({
                element: `card-2-${r2}`,
                content: elem.content,
              });
              r2++;
            } else {
              arrayOfCards.push({
                element: `card-3-${r3}`,
                content: elem.content,
              });
              r3++;
            }
            rowCounter++;
          }
        }

        //A lent lévő kártyák kitörlése
        setGame.dealtCards = [[], [], []];
        let c = 1;
        for (cardPlace of document.querySelectorAll(".ingame-card")) {
          cardPlace.innerHTML = "";
          if (c % (inGameData.colCount + 1) == 0) {
            cardPlace.classList.remove("ingame-card");
            cardPlace.classList.add("ingame-card-placeholder");
          }
          c++;
        }

        //A felszedett kártyák újraosztása egyel kisebb alakzatba
        for (elem of arrayOfCards) {
        }
        let counter = 0;
        for (card of arrayOfCards) {
          if (counter < inGameData.colCount) {
            setGame.dealtCards[0].push({
              element: card.element,
              content: card.content,
            });
          } else if (counter < inGameData.colCount * 2) {
            setGame.dealtCards[1].push({
              element: card.element,
              content: card.content,
            });
          } else {
            setGame.dealtCards[2].push({
              element: card.element,
              content: card.content,
            });
          }
          counter++;
          drawOut(document.getElementById(card.element), card.content);
        }

        //Ha már nincs lent set, és üres a pakli, vége a játéknak
        if (!isThereSet()) {
          //Játék vége
          inGameData.gameEnded = true;
          endGameData.gameDifficulty = gameSettings.difficulty;
          endGameData.gameMode = gameSettings.mode;
          endGameData.gameTime = inGameData.timeSpent;
          sleep(200);
          for (player of inGameData.playerData) {
            endGameData.playerDatas.push(player);
          }
          showEndScreen();
        }
      }
    } else {
      //Ha nem SET

      //Nem Set! felirat kiírása
      gameScreenElements.textContent.innerText = "Nem Set!";

      //Piros háttér animáció
      for (card of inGameData.selectedCards) {
        card.classList.remove("clicked");
      }
      for (let i = 0; i < 2; i++) {
        inGameData.selectedCards[0].classList.add("wrong");
        inGameData.selectedCards[1].classList.add("wrong");
        inGameData.selectedCards[2].classList.add("wrong");
        await sleep(250);
        inGameData.selectedCards[0].classList.remove("wrong");
        inGameData.selectedCards[1].classList.remove("wrong");
        inGameData.selectedCards[2].classList.remove("wrong");
        await sleep(250);
      }

      //Játékos blokkolása, pont levonása
      addPlayerPoints(inGameData.activePlayer, false);
      inGameData.blockedPlayers.push(inGameData.activePlayer);
      for (elem of gameScreenElements.inGamePlayerListElements) {
        if (elem.id == inGameData.activePlayer.id) {
          elem.classList.add("blocked-player");
        }
      }

      //Ha mindenki blokkolt, álljon vissza mindenki rendesre
      let count = 0;
      for (player of inGameData.playerData) {
        if (!(player.name == "")) count++;
      }

      if (inGameData.blockedPlayers.length == count) {
        inGameData.blockedPlayers = [];
        for (elem of gameScreenElements.inGamePlayerListElements) {
          elem.classList.remove("blocked-player");
        }
      }

      //Ha nem egyjátékos módban van, akkor szűnjön meg az aktív játékos
      if (!gameSettings.onePlayerMode) {
        inGameData.activePlayer = null;
        for (elem of gameScreenElements.inGamePlayerListElements) {
          elem.classList.remove("selected-player");
        }
        //Egyéni 10 mp-es időzítő törlése
        clearTimeout(inGameData.activePlayerTimer);
      }
    }
    //Kijelölt kártyák visszaállítása alaphelyzetbe
    for (ingameCard of document.querySelectorAll(".ingame-card")) {
      ingameCard.classList.remove("clicked");
      inGameData.selectedCardsCount = 0;
      inGameData.selectedCards = [];
      inGameData.selectedCardContents = [];
    }
  }
}

//Pakli létrehozása (nehézség szerint), megkeverése
function deckSetup(difficulty) {
  // Pakli generálása
  if (difficulty) {
    setGame.deck.advancedGenerate();
  } else {
    setGame.deck.easyGenerate();
  }

  //Pakli megkeverése 1 és 10 közötti véletlen akalommal
  let numberOfShuffles = Math.floor(Math.random() * 10) + 1;
  for (let i = 1; i <= numberOfShuffles; i++) {
    setGame.deck.shuffleDeck();
  }
}

//Lapok kiosztása
function dealCards() {
  //12 lap leosztása
  let counter = 0;
  for (card of gameScreenElements.cards) {
    if (card.childNodes.length == 0) {
      let drawnCard = setGame.deck.content.pop();
      if (counter < 4) {
        setGame.dealtCards[0].push({ element: card.id, content: drawnCard });
      } else if (counter < 8) {
        setGame.dealtCards[1].push({ element: card.id, content: drawnCard });
      } else {
        setGame.dealtCards[2].push({ element: card.id, content: drawnCard });
      }
      counter++;
      drawOut(card, drawnCard);
      addCardEvents(card);
    }
  }
}

//Kártyákra kattintás, jobbkattintás kezelése
function addCardEvents(card) {
  card.addEventListener("click", (e) => {
    //Ha van kiválasztott játékos
    if (inGameData.activePlayer) {
      if (
        !inGameData.selectedCards.includes(e.target.closest(".ingame-card"))
      ) {
        if (inGameData.selectedCardsCount <= 3) {
          /**
           * Attól függően kerül kiválasztásra, hogy mi kerül a selectedCards listába,
           * Hogy az elemen belül hova kattint a felhasználó
           */
          if (e.target.classList.contains("ingame-card")) {
            e.target.classList.add("clicked");
            e.target.classList.remove("show-set");
            inGameData.selectedCards.push(e.target);
            inGameData.selectedCardsCount++;
          } else if (
            e.target.closest(".ingame-card").classList.contains("ingame-card")
          ) {
            e.target.closest(".ingame-card").classList.add("clicked");
            e.target.closest(".ingame-card").classList.remove("show-set");
            inGameData.selectedCards.push(e.target.closest(".ingame-card"));
            inGameData.selectedCardsCount++;
          }
        }
        checkIfThreeSelected();
      }
    }
  });

  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (inGameData.activePlayer) {
      if (e.target.closest(".ingame-card").classList.contains("clicked")) {
        let i = inGameData.selectedCards.indexOf(
          e.target.closest(".ingame-card")
        );
        if (i > -1) {
          inGameData.selectedCards.splice(i, 1);
        }
        if (inGameData.selectedCardsCount > 0) {
          inGameData.selectedCardsCount--;
        }
        e.target.closest(".ingame-card").classList.remove("clicked");
      }
    }
  });
}

//Segítség gombok eseménykezelése
function addButtonEvents(button) {
  if (button.id == "is-there-set-button") {
    button.addEventListener("click", (e) => {
      isThereSet()
        ? (gameScreenElements.textContent.innerText = "Van set.")
        : (gameScreenElements.textContent.innerText = "Nincs set.");
    });
  }
  if (button.id == "show-set-button") {
    button.addEventListener("mousedown", (e) => {
      showSet();
    });
    button.addEventListener("mouseup", (e) => {
      hideSet();
    });
  }
  if (button.id == "plus-three-cards-button") {
    button.addEventListener("click", (e) => {
      if (!inGameData.threeWasAdded) plusThreeCards();
    });
  }
}

//Ha van a leosztásban set, igaz értékkel, ha nincs akkor hamissal tér vissza
function isThereSet() {
  let isThereSet = false;
  let theSet;
  //Mátrix listává konvertálása
  let arrayOfCards = new Array();
  for (row of setGame.dealtCards) {
    for (elem of row) {
      arrayOfCards.push(elem.content);
    }
  }

  //Lista átvizsgálása
  for (let i = 0; i < arrayOfCards.length; i++) {
    for (let j = i + 1; j < arrayOfCards.length; j++) {
      for (let k = j + 1; k < arrayOfCards.length; k++) {
        if (checkIfSet([arrayOfCards[i], arrayOfCards[j], arrayOfCards[k]])) {
          isThereSet = true;
          theSet = [arrayOfCards[i], arrayOfCards[j], arrayOfCards[k]];
        }
      }
    }
  }
  if (isThereSet) {
    inGameData.setToShow = theSet;
  }

  //Pakli méretének frissítése a dokumentumon belül
  gameScreenElements.deckSizeDisplay.innerText = String(
    setGame.deck.content.length
  ).padStart(2, "0");

  return isThereSet;
}

//Ha van SET, megmutatja, hogy hol.
function showSet() {
  if (isThereSet() && !inGameData.gameEnded) {
    for (row of setGame.dealtCards) {
      for (card of row) {
        if (inGameData.setToShow.includes(card.content)) {
          document.getElementById(card.element).classList.add("show-set");
        }
      }
    }
  } else if (!inGameData.gameEnded) {
    gameScreenElements.textContent.innerText = "Nincs set.";
  }
}

//Ha van SET, elrejti, hogy hol.
function hideSet() {
  if (isThereSet() && !inGameData.gameEnded) {
    for (row of setGame.dealtCards) {
      for (card of row) {
        if (inGameData.setToShow.includes(card.content)) {
          document.getElementById(card.element).classList.remove("show-set");
        }
      }
    }
  }
}

//Hozzáad 3 lapot a pályához, ha kevesebb lap van lent, mint 15.
function plusThreeCards() {
  let rc = 1;
  if (!inGameData.threeWasAdded && setGame.deck.content.length >= 3) {
    for (row of setGame.dealtCards) {
      let drawnCard = setGame.deck.content.pop();
      row.push({ element: `card-${rc}-5`, content: drawnCard });
      drawOut(document.getElementById(row[4].element), row[4].content);
      rc++;
    }

    inGameData.colCount = 5;
    inGameData.threeWasAdded = true;
  }

  gameScreenElements.textContent.innerText = "+3 lap";

  //Pakli méretének frissítése a dokumentumon belül
  gameScreenElements.deckSizeDisplay.innerText = String(
    setGame.deck.content.length
  ).padStart(2, "0");
}
