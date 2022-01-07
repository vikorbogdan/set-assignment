//Főmenüben lévő, nehézséget állító kapcsoló
function loadDifficultySlider() {
  let slider = document.getElementById("menu-difficulty-switch");
  slider.checked = false;

  slider.addEventListener("click", () => {
    if (slider.checked) {
      gameSettings.difficulty = true;
      document.documentElement.style.setProperty("--slidercontent", "'Haladó'");
      document.documentElement.style.setProperty("--slidercolor", "#FDFDFD");
      document.documentElement.style.setProperty("--sliderleft", "11px");
    } else {
      gameSettings.difficulty = false;
      document.documentElement.style.setProperty("--slidercontent", "'Kezdő'");
      document.documentElement.style.setProperty("--slidercolor", "#8B8B8B");
      document.documentElement.style.setProperty("--sliderleft", "37px");
    }
  });
}

//Az egyéb beállításokban lévő kapcsolók vizsgálata
function loadOptionsSliders() {
  optionsElements.isThereSetSlider.checked
    ? (gameSettings.activeButtons[0] = true)
    : (gameSettings.activeButtons[0] = false);
  optionsElements.plusThreeSlider.checked
    ? (gameSettings.activeButtons[1] = false)
    : (gameSettings.activeButtons[1] = true);
  optionsElements.showSetSlider.checked
    ? (gameSettings.activeButtons[2] = true)
    : (gameSettings.activeButtons[2] = false);
}
