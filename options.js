let language;
setTimeout(function () {
  try {
    language = localStorage.getItem(languageSelected);
  } catch (e) {
    console.log(e);
    document.getElementById(
      "languageSelectedInfo"
    ).innerHTML = `No language had been selected yet`;
    console.error("No language was chosen yet");
  } finally {
    if (language) {
      document.getElementById(
        "languageSelectedInfo"
      ).innerHTML = `Translation language is set to ${language}`;
    }
  }
}, 3000);

const button = document
  .getElementById("saveButton")
  .addEventListener("click", function () {
    console.log("saving");
    const languageSelected = document.getElementById("languageListInput").value;

    let languageCode = document.querySelector(
      "#languageDataList" + " option[value='" + languageSelected + "']"
    );
    if (languageCode) {
      console.log("there is a language code");
      languageCode = languageCode.dataset.value.toLowerCase();
      localStorage.setItem("languageSelected", languageSelected);
      localStorage.setItem("languageCode", languageCode);
      chrome.storage.sync.set({ languageSelected, languageCode }, function () {
        console.log(
          `"${languageSelected}" was selected, language code is set to "${languageCode}"`
        );
      });
      document.getElementById(
        "languageSelectedInfo"
      ).innerHTML = `Translation language is set to ${languageSelected}`;
    }
  });
