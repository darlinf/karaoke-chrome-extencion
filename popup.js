let changeColor = document.getElementById("changeColor");

/* eslint-disable */
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    // eslint-disable-line

    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});
/* eslint-enable */

function setPageBackgroundColor() {
  //Get element by id similar to jQuery
  const $ = (selector) => document.querySelector(selector);

  let suptitleOne = "";
  let suptitleTwo = "";

  const soundSVG = `
   <svg focusable="false" xmlns="http://www.w3.org/2000/svg"  width="30px" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg> 
  `;

  const microphoneSVG = `
  <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>
  `;

  /*const playSVG = `
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><path  d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-72"></path></svg>
  `;*/

  const popupStyles = /*css*/ `
  .popup:hover{
    color:red;
  }
  .select-color{
    color:red;
  }
  .popup {
  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* The actual popup */
.popup .popuptext {
  visibility: hidden;
  min-width: 160px;
  color: #fff;
  text-align: center;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
  display:flex;
  justify-content: center;
}

/* Popup arrow */
.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}
.popup button{
    width: 25px;
    height: 25px;
    margin: 3px;
    border-radius: 100%;
    border: none; 
    cursor: pointer;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;} 
  to {opacity: 1;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:1 ;}
  }`;

  const popupContainerStyles = /*css*/ `
  .captions-text{
    background: rgba(8, 8, 8, 0.75);
    font-size: 19px;
  }
  `;

  const sentenceContainerStyles = /*css*/ `
     * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      .pronounce-sentence {
        margin-top: 10px;
        width: 100%;
        position: relative;
        top: 5px;
        background: #d8d8d870;
        cursor: initial;
        border-radius: 5px;

        display: flex;
        padding: 2px;
        justify-content: "center";
      }

      .pronounce-sentence button {
        width: 25px;
        height: 25px;
        margin: 5px;
        border-radius: 100%;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .pronounce-sentence svg:hover {
        fill: white;
      }

      .pronounce-sentence button:hover {
        background-color:rgb(175, 175, 175);
      }

      p{
        font-size: 19px;
        text-align:center;
      }

      #pronounce-resurt{
        align-self: center;
        margin-left: 5px;
      }
  `;

  //Custom html subtitle element

  function addPopup(captionsText, suptitle, captionsTextId = "") {
    //Reset inner html of first container and reset styles
    captionsText.style = "";
    captionsText.innerHTML = "";

    //Add popup and show custom subtitle element
    suptitle.split(" ").forEach((subtitleWord, index) => {
      captionsText.innerHTML += /*html*/ `
          <span class="popup" id="myPopupContainer">${subtitleWord}
            <span class="popuptext " id="myPopup_${captionsTextId}${index}">
             <div id="button-word-action_${captionsTextId}${index}" style="display:flex; background-color: #555; width: fit-content;border-radius: 6px; ">
              <button id="word-recognise-voice_${captionsTextId}${index}">${microphoneSVG}</button>
              <button id="word-speak-voice_${captionsTextId}${index}">${soundSVG}</button>
               <p style="align-self: center; margin: 5px;" id="word-speak-resurt_${captionsTextId}${index}"></p>
             </div>
            </span>
          </span>`;
    });
  }

  const pronounceSentenceHTML = /*html*/ `
      <div class="pronounce-sentence">
        <div>
          <button id="recognise-voice">${microphoneSVG}</button>
          <button id="speak-voice">${soundSVG}</button>
          <!--<button id="next-music-lyric">{playSVG}</button>-->  
        </div>
        <div id="pronounce-resurt"></div>
      </div>
  `;

  const speak = (
    textToSpeak = "hello",
    speakEnd = () => {},
    pitchV = 0.7,
    rateV = 0.5,
    voice = "Google US English"
  ) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      console.error("speechSynthesis.speaking");
      return;
    }

    if (textToSpeak !== "") {
      const utterThis = new SpeechSynthesisUtterance(textToSpeak);

      utterThis.onend = function (/*event*/) {
        speakEnd();
        console.log("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = function (/*event*/) {
        console.error("SpeechSynthesisUtterance.onerror");
      };

      let voices = synth.getVoices();

      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === voice) {
          utterThis.voice = voices[i];
          break;
        }
      }

      utterThis.pitch = pitchV;
      utterThis.rate = rateV;
      synth.speak(utterThis);
    }
  };

  function comparationText(test) {
    if (test) document.querySelector(".pronounce-sentence").innerHTML += "✓";
    else document.querySelector(".pronounce-sentence").innerHTML += "X";
  }

  function recogniseVoice(voiceResult) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = function (event) {
      console.log("Confidence: " + event.results[0][0].transcript);
      console.log("Confidence: " + event.results[0][0].confidence);
      voiceResult(event.results[0][0].transcript);
    };

    recognition.onerror = function () {
      voiceResult("don't recognition");
    };
  }

  function getElementByIdAndAddEvent(elementName, callbackListener) {
    ["click", "touchstart"].forEach((eventName) => {
      document
        .getElementById(elementName)
        .addEventListener(eventName, callbackListener);
    });
  }

  function addEventToPopup(arrayElement, suptitleOne, captionsText = "") {
    //Add event to show popup
    let index = 0;

    for (const element of arrayElement) {
      //Prevent popup from closing when clicked
      getElementByIdAndAddEvent(`myPopup_${captionsText}${index}`, (e) => {
        e.stopPropagation();
      });

      //Add styles class when fire event
      ["click", "touchstart"].forEach((eventName) => {
        element.addEventListener(eventName, () => {
          console.log(element);
          element.childNodes[1].classList.toggle("show");
          element.classList.toggle("select-color");
        });
      });

      //Word pronounce button action
      let wordToPronounce = suptitleOne.split(" ")[index];
      getElementByIdAndAddEvent(
        `word-recognise-voice_${captionsText}${index}`,
        () => {
          recogniseVoice((x) => {
            console.log(`word-speak-resurt_${captionsText}${index}`);
            $(`#word-speak-resurt_${captionsText}${index}`).innerHTML = x;
            console.log(x);
            comparationText(x === suptitleOne);
          });
        }
      );

      getElementByIdAndAddEvent(
        `word-speak-voice_${captionsText}${index}`,
        () => {
          speak(wordToPronounce);
        }
      );

      index++;
    }
  }

  function getTextSuptitle() {
    let suptitleContainer = document.querySelector(".captions-text");
    //Get text context from children
    suptitleOne = suptitleContainer.children[0].textContent;
    suptitleTwo = suptitleContainer?.children[1]?.textContent ?? "";

    console.log(suptitleOne);

    suptitleContainer.innerHTML += /*html*/ `
    <style> 
        ${sentenceContainerStyles}
        ${popupStyles}
        ${popupContainerStyles}
    </style> 
      ${pronounceSentenceHTML}
    `;

    //Get child node to add custon suptitle and popup
    let captionsTextFirst =
      document.querySelector(".captions-text").children[0].childNodes[0];
    addPopup(captionsTextFirst, suptitleOne);
    addEventToPopup(captionsTextFirst.children, suptitleOne);

    if (document.querySelectorAll(".caption-visual-line").length === 2) {
      console.log({ suptitleTwo });
      let captionsTextSecond =
        document.querySelector(".captions-text").children[1].childNodes[0];
      addPopup(captionsTextSecond, suptitleTwo, "second_subtitle");
      addEventToPopup(
        captionsTextSecond.children,
        suptitleTwo,
        "second_subtitle"
      );
    }

    /*document.getElementById(
      "pronounce-resurt"
    ).innerHTML = `<p>${suptitleOne}</p><p>${suptitleTwo}</p>`;*/

    //Sentence pronounce button action//document.querySelector(".caption-window").style.width = "fit-content";
    getElementByIdAndAddEvent("recognise-voice", () => {
      recogniseVoice((x) => {
        console.log(x);
        comparationText(x === suptitleOne);
      });
    });

    getElementByIdAndAddEvent("speak-voice", () => {
      speak(suptitleOne.replace("♪", ""));
    });
  }

  let playPause = document.querySelector(
    "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button"
  );
  let elementIfPresent = document.querySelector(".captions-text");

  //Check if subtitles are present and pause the
  function searchSubtitles() {
    var intervalId = setInterval(() => {
      elementIfPresent = document.querySelector(".captions-text");

      if (elementIfPresent) {
        console.log("is present");
        playPause.click();
        clearInterval(intervalId);
        getTextSuptitle();

        speak(suptitleOne + " " + suptitleTwo, () => {
          recogniseVoice((x) => {
            $("#pronounce-resurt").innerHTML = `${x}`;
            setTimeout(() => {
              playPause.click();
              elementIfPresent.remove();
              searchSubtitles();
            }, 2000);
          });
        });

        console.log(1);
      }
    }, 1);
  }

  playPause.addEventListener("click", () => {
    //elementIfPresent.remove();
    //searchSubtitles();
    console.log("ddddddddd");
  });

  searchSubtitles();
}
