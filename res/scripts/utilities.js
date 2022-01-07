//Várakozás - használata: await sleep(200)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Alap SVG alakzatok elmentése
const svgShapes = {
  oval: document.getElementById("oval").cloneNode(true),
  squiggle: document.getElementById("squiggle").cloneNode(true),
  diamond: document.getElementById("diamond").cloneNode(true),
};

//Függvény delegáláshoz (bit.ly/web-thor)
function delegal(szulo, gyerek, mikor, mit) {
  function esemenyKezelo(esemeny) {
    let esemenyCelja = esemeny.target;
    let esemenyKezeloje = this;
    let legkozelebbiKeresettElem = esemenyCelja.closest(gyerek);

    if (esemenyKezeloje.contains(legkozelebbiKeresettElem)) {
      mit(esemeny, legkozelebbiKeresettElem);
    }
  }

  szulo.addEventListener(mikor, esemenyKezelo);
}

//Keverés függvény (Fisher-Yates algoritmus)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//Játékállapot megjelenítése
function showState(state) {
  if (
    state == states.loadingScreen ||
    state == states.gameOver ||
    state == states.tutorial
  ) {
    state.style.display = "flex";
    state.style.opacity = 1;
  } else if (state == states.gameScreen) {
    state.style.display = "grid";
    state.style.opacity = 1;
  } else {
    state.style.display = "block";
    state.style.opacity = 1;
  }
  currentState = state;
}

//Játékállapot elrejtése
function hideState(state) {
  state.style.display = "none";
  state.style.opacity = 0;
}
