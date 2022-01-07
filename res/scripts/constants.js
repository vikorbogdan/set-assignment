//Játékosok neve max ennyi karakter lehet
const maxPlayerName = 8;

//SET alapszínek (piros, kék, zöld)
const setColors = {
  red: "#FF387C",
  green: "#70e632",
  blue: "#387CFF",
};

//Lehetséges játékos színek nevei
const playerColors = [
  "grey",
  "yellow",
  "orange",
  "red",
  "magenta",
  "purple",
  "dark-blue",
  "aqua",
  "teal",
  "green",
  "olive",
];

//Játékos színek sötétebb árnyalata
const primaryColors = {
  yellow: "rgb(255, 215, 0)",
  orange: "#ff9000",
  red: "#f01818",
  magenta: "#f00090",
  purple: "#601878",
  darkBlue: "#001890",
  aqua: "#00c0f0",
  teal: "#00a890",
  green: "#00a848",
  olive: "#c0d800",
};

//Játékos színek világosabb árnyalata
const secondaryColors = {
  yellow: "#ffffd8",
  orange: "#fff0d8",
  red: "#ffd8d8",
  magenta: "#ffd8f0",
  purple: "#f0c0ff",
  darkBlue: "#c0d8ff",
  aqua: "#c0f0ff",
  teal: "#c0fff0",
  green: "#c0ffd8",
  olive: "#f0ffd8",
};

//Főmenü elemei
const menuElements = {
  startButton: document.getElementById("start-button"),
  rulesButton: document.getElementById("game-rules"),
  modeButton: document.getElementById("mode-toggle"),
  settingsButton: document.getElementById("other-settings"),
  playerCountButton: document.getElementById("number-selector"),
  playerList: document.querySelectorAll(".player-list-element"),
  topListHeader: document.getElementById("top-list-header"),
  tutorialExit: document.getElementById("tutorial-exit"),
  toplist: document.querySelectorAll("#top-list table tr"),
};

//Egyéb beállítások elemei
const optionsElements = {
  backButton: document.getElementById("extra-options-back"),
  isThereSetSlider: document.getElementById("is-there-set-switch"), //default true
  showSetSlider: document.getElementById("show-set-switch"), //default true
  plusThreeSlider: document.getElementById("plus-three-card-switch"), //default false
};

//Játék vége elemei
const gameOverElements = {
  content: document.getElementById("game-over-content"),
  menuButton: document.getElementById("game-over-menu-button"),
  restartButton: document.getElementById("game-over-restart-button"),
  scoreboard: document.querySelector("#player-scores-table tbody"),
  spentTime: document.getElementById("game-over-time-spent"),
  tableContainer: document.querySelector("#game-over-content #table-container"),
  resultsHeader: document.getElementById("game-over-results-header"),
};

//Játékállapotok, amelyek egyes képernyőknek feleltethetőek meg
const states = {
  mainMenu: document.getElementById("menu-state"),
  options: document.getElementById("options-state"),
  gameScreen: document.getElementById("game-state"),
  loadingScreen: document.getElementById("loading-state"),
  gameOver: document.getElementById("end-state"),
  tutorial: document.getElementById("tutorial-state"),
};

//Local Storage toplista
const localData = window.localStorage;

//Toplisták lehetséges címeinek listája
const topListTitles = ["Top 10 kezdő", "Top 10 haladó"];
