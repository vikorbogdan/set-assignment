//Nem konstans, változhat a lent lévő kártyák miatt (+-3)
let gameScreenElements = {
  cards: document.querySelectorAll(
    "#ingame-gamearea div:not(.ingame-card-placeholder)"
  ),
  textContent: document.querySelector(
    "#ingame-text-display .ingame-text-content"
  ),
  inGamePlayerList: document.getElementById("ingame-player-list"),
  inGamePlayerListElements: document.querySelectorAll(
    "#ingame-player-list ul li"
  ),
  playerListCircles: document.querySelectorAll(
    "#ingame-player-list ul li .circle"
  ),
  playerListNames: document.querySelectorAll(
    "#ingame-player-list ul li .ingame-player-name"
  ),
  helpButtons: document.querySelectorAll(".ingame-button"),
  timeDisplay: document.getElementById("ingame-time-display"),
  deckSizeDisplay: document.querySelector(
    "#ingame-set-logo + .tooltip-text strong"
  ),
};

//Játékbeállítások, amelyek a Játékképernyő állapot betöltésekor lépnek érvénybe
let gameSettings = {
  /*
      ~mode
      false: Gyakorló mód
      true: Verseny mód
    */
  mode: true,
  /*
      ~players
      Játékosok nevének listája
    */
  players: new Array(),
  /*
      ~numOfPlayers
      Játékosok száma (max 10)
    */
  numOfPlayers: 0,
  /*
      ~difficulty
      false: Könnyű
      true: Haladó
    */
  difficulty: false, // ./slidercheckbox.js
  /* 
    ~activeButtons
    A játék képernyőn lévő segítség buttonok közül adja meg, melyik legyen aktív (egyéb beállítások alapján)
    activeButtons[0] : Van SET? button
    activeButtons[1] : +3 lap button
    activeButtons[2] : SET mutatása button
    */
  activeButtons: [true, true, true],
  /*
  ~onePlayerMode
  Ha true, akkor egyjátékos módban van a játék
  */
  onePlayerMode: false,
};

//Játék működéséhez szükséges adatok
let inGameData = {
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

//Kártyákkal kapcsolatos adatok
let setGame = {
  /*
    ~dealtCards
    aktuálisan leosztott lapok
    fentről lefele, balról jobbra
    */
  dealtCards: [[], [], []],
  cardAttributes: {
    shapes: ["squiggle", "oval", "diamond"],
    counts: [1, 2, 3],
    fills: ["full", "striped", "empty"],
    colors: ["red", "green", "blue"],
  },
  deck: {
    advancedGenerate: () => {
      //81 lapos pakli
      setGame.deck.content = [];
      let pakli = new Array();
      for (shape of setGame.cardAttributes.shapes) {
        for (count of setGame.cardAttributes.counts) {
          for (fill of setGame.cardAttributes.fills) {
            for (color of setGame.cardAttributes.colors) {
              pakli.push({
                shape: this.shape,
                count: this.count,
                fill: this.fill,
                color: this.color,
              });
            }
          }
        }
      }
      console.log(pakli);
      setGame.deck.content = pakli;
    },
    easyGenerate: () => {
      //27 lapos pakli
      setGame.deck.content = [];
      let pakli = new Array();
      for (shape of setGame.cardAttributes.shapes) {
        for (count of setGame.cardAttributes.counts) {
          for (color of setGame.cardAttributes.colors) {
            pakli.push({
              shape: this.shape,
              count: this.count,
              color: this.color,
            });
          }
        }
      }
      console.log(pakli);
      setGame.deck.content = pakli;
    },
    content: new Array(),
    shuffleDeck: () => {
      shuffle(setGame.deck.content);
    },
  },
};

//Játék befejezésekor szükséges adatok
let endGameData = {
  gameTime: 0,
  playerDatas: [],
  gameMode: false, //Verseny (true) / Gyakorló (false)
  gameDifficulty: false, //Haladó (true) / Kezdő (false)
};

//Segédváltozó, kártyák kiválastásakor, ha a 3 kártya set, ebbe tárolódik el az indexük
let cardIndexes;

//A toplisták váltogatásához szükséges változó
let activeToplist = 1;

//Toplisták (a local storage-el szinkronban áll)
let toplists = {
  beginner: [],
  advanced: [],
};

//Aktuális játékállapotot tartalmazó változó
let currentState;
