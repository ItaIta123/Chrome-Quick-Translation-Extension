let goToOptionsButton = document.getElementById("goToOptions");

document.addEventListener("DOMContentLoaded", function () {
  goToOptionsButton.addEventListener("click", () => {
    console.log(JSON.stringify(goToOptionsButton));
    chrome.tabs.create({
      url: "chrome-extension://odiiopjdkoojpgalaoahpkbmcgcaknbb/options.html",
    });
    alert(JSON.stringify(goToOptionsButton));
  });
});

// // Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// // The body of this function will be executed as a content script inside the
// // current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
