require("dotenv").config();
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");
// browserify ./translator.js > ./bundle.js
// ADD DICTIONARY OPTION : https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support#:~:text=to%20display%20alternative-,translations,-from%20or%20to
// ADD TEXT TO SPEECH USING CHROME DEVELOPER - https://developer.chrome.com/docs/extensions/reference/#:~:text=Use%20the%20chrome.tts%20API%20to%20play%20synthesized%20text-to-speech%20(TTS).%20See%20also%20the%20related%20ttsEngine%20API%2C%20which%20allows%20an%20extension%20to%20implement%20a%20speech%20engine.

let language = null;
console.log("Started");
// Get Selected Languaage from Chrome Storage
chrome.storage.sync.get(["languageCode"], function (result) {
  language = result.languageCode;
  console.log(`Translating to: ${language}`);
});

// Add bubble to the top of the page.
let transBubble = document.createElement("div");
transBubble.setAttribute("class", "transBubble");
document.body.append(transBubble);
let transText = document.createElement("span");
transText.setAttribute("class", "transText");
transBubble.append(transText);

// Lets listen to mouseup DOM events.
document.addEventListener(
  "mouseup",
  (e) => {
    // Get Selection Object
    let selection = window.getSelection();
    if (selection.toString().length > 0) {
      let rangeObject =
        selection.getRangeAt(
          0
        ); /* https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect */
      let domrRectObject =
        rangeObject.getBoundingClientRect(); /* https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect */

      const subscriptionKey = process.env.AZURE_TRANSLATE_SECRET_KEY;
      const endpoint = "https://api.cognitive.microsofttranslator.com";

      // Add your location, also known as region. The default is global.
      // This is required if using a Cognitive Services resource.
      const location = "global";
      console.log("before azure");
      axios({
        baseURL: endpoint,
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        params: {
          "api-version": "3.0",
          from: "en",
          to: [language],
        },
        data: [
          {
            text: selection.toString(),
          },
        ],
        responseType: "json",
      }).then(function (response) {
        console.log("after azure");

        let x = (domrRectObject.left + domrRectObject.right) / 2 - 40; // I have found that using DOMR Rect Object for X and Y corrdindnts is more accurate compared to clientX/Y, pageX/Y, and screenX/Y.
        let y = e.pageY - 50;
        renderBubble(x, y, response.data[0].translations[0].text);
      });
    }
  },
  false
);

// Close the bubble when we click on the screen.
document.addEventListener(
  "mousedown",
  () => {
    transBubble.style.visibility = "hidden";
    transText.style.visibility = "hidden";
  },
  false
);

// Move that bubble to the appropriate location.
const renderBubble = (mouseX, mouseY, selection) => {
  // transText.style.maxHeight = "10px";
  // transBubble.style.width = "600px";
  // transBubble.style.display = "flex";
  // transBubble.style.alignItems = "center";
  // transBubble.style.justifyContent = "center";
  transBubble.style.top = mouseY + "px";
  transBubble.style.left = mouseX + "px";
  transText.style.display = "flex";
  transText.style.justifyContent = "center";
  // transText.style.maxHeight = "200px";
  // transText.style.overflow = "scroll";
  // switch (selection) {
  // }
  // transText.style.width = "200px";

  // transText.style.padding = "10px 20px 10px 20px";
  transText.innerHTML = selection;
  transText.style.visibility = "visible";
};
