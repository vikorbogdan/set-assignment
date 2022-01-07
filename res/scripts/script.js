//
//Betöltéskor lefutó program//
//

//eredeti SVG DOM elemek törlése
for (svg of document.querySelectorAll("body>svg")) {
  svg.remove();
}

//Alapbeállítások állítása
optionsElements.isThereSetSlider.checked = true;
optionsElements.showSetSlider.checked = true;
optionsElements.plusThreeSlider.checked = false;

//Local storage
if (!localData.getItem("toplists")) {
  localData.setItem("toplists", JSON.stringify({ beginner: [], advanced: [] }));
} else {
  toplists = JSON.parse(localData.getItem("toplists"));
}

//Menü betöltése
loadMenu();
