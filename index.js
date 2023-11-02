// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Firebase app setup
const appSettings = {
  databaseURL:
    "https://we-are-the-champions-20eb9-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings); // Creates Firebase app
const database = getDatabase(app); // Creates database obj
const endorsementListInDB = ref(database, "endorsements"); // Creates reference to database location

// DOM elements
const endorsementInput = document.querySelector("#message__endorsement");
const fromInput = document.querySelector("#message__details--from");
const toInput = document.querySelector("#message__details--to");
const endorsementList = document.querySelector("#endorsement__list");
const publishBtn = document.querySelector("#publish-btn");

// Captures input field values
const captureInputValues = () => {
  const endorsementInputValue = endorsementInput.value;
  const fromInputValue = fromInput.value;
  const toInputValue = toInput.value;

  createEndorsementObj(endorsementInputValue, fromInputValue, toInputValue);
};

// Creates a new object to contain the captured input field values
const createEndorsementObj = (endorsementVal, fromVal, toVal) => {
  const endorsement = {
    message: endorsementVal,
    from: fromVal,
    to: toVal,
    favorites: 0,
  };

  addEndorsementToDB(endorsement);
};

// Pushes the endorsement object to the DB
const addEndorsementToDB = (endorsementObject) =>
  push(endorsementListInDB, endorsementObject);

// Event listener for 'Enter' key on the "To" input field (keyboard users)
toInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    captureInputValues();
  }
});

// Event listener for "Publish" btn click
publishBtn.addEventListener("click", () => {
  captureInputValues();
});

// Captures snapshot values
const captureSnapshotValues = (snap) => {
  if (snap.exists()) {
    const snapshotObject = snap.val(); // Object with unique keys and object values for each endorsement in the DB
    const snapshotEntries = Object.entries(snapshotObject); // Converted to an array where [0] is the unique key and [1] is the object w/ the values
    const snapshotEntriesReversed = snapshotEntries.reverse(); // Ensures that the newest endorsement shows first

    createEndorsementCards(snapshotEntriesReversed);
  } else {
    endorsementList.textContent =
      "No endorsements yet, add a message for your team 🥳";
  }
};

// Firebase method that runs the callback function on each update to the DB reference
onValue(endorsementListInDB, (snapshot) => {
  captureSnapshotValues(snapshot);
});

// Creates the endorsement cards
const createEndorsementCards = (snapEntriesArray) => {
  const cards = snapEntriesArray.map((snapEntry) => {
    return createCard(snapEntry);
  });

  renderCards(cards);
};

// Creates an individual endorsement card
const createCard = (entry) => {
  const heartIcon = `<button class="heart-icon__container"><svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21" fill="none">
  <path d="M20.84 2.60999C20.3292 2.099 19.7228 1.69364 19.0554 1.41708C18.3879 1.14052 17.6725 0.998169 16.95 0.998169C16.2275 0.998169 15.5121 1.14052 14.8446 1.41708C14.1772 1.69364 13.5708 2.099 13.06 2.60999L12 3.66999L10.94 2.60999C9.9083 1.5783 8.50903 0.998704 7.05 0.998704C5.59096 0.998704 4.19169 1.5783 3.16 2.60999C2.1283 3.64169 1.54871 5.04096 1.54871 6.49999C1.54871 7.95903 2.1283 9.3583 3.16 10.39L4.22 11.45L12 19.23L19.78 11.45L20.84 10.39C21.351 9.87924 21.7563 9.27281 22.0329 8.60535C22.3095 7.93789 22.4518 7.22248 22.4518 6.49999C22.4518 5.77751 22.3095 5.0621 22.0329 4.39464C21.7563 3.72718 21.351 3.12075 20.84 2.60999Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></button>`;
  const cardId = entry[0];
  const cardEntries = Object.entries(entry[1]);
  let cardContents = "";

  cardEntries.forEach((cardEntryItem) => {
    const cardItemKey = cardEntryItem[0];
    const cardItemVal = cardEntryItem[1];
    const cardValue = `<p class="${cardItemKey}" id="${cardItemKey}">${cardItemVal}</p>`;
    cardContents += cardValue;
  });

  const card = document.createElement("li");
  card.innerHTML += cardContents + heartIcon;
  card.id = cardId;
  card.className = "card flex-column";

  return card;
};

// Clears the endorsements list
const clearEndorsementList = () => {
  endorsementList.innerHTML = "";
};

// Clears input field values
const clearInputs = () => {
  const inputs = document.querySelectorAll(".text-input");

  inputs.forEach((input) => (input.value = ""));
};

// Renders the endorsement cards
const renderCards = (endorsementCards) => {
  clearEndorsementList(); // Clears current list

  endorsementCards.forEach((card) => endorsementList.append(card));

  clearInputs(); // Clear input field values

  setHeartIconListeners(); // Sets event listeners on the new heart icons
};

const setHeartIconListeners = () => {
  // Selects the buttons that contain the heart icons
  const heartIconContainers = document.querySelectorAll(
    ".heart-icon__container"
  );

  // Adds a click listener for each button
  heartIconContainers.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      toggleIconClass(e.target);
    });
  });
};

// Adds or removes the "clicked-icon" class
const toggleIconClass = (clickedIconBtn) => {
  // Targets the svg for each clicked btn
  const svg = clickedIconBtn.querySelector(":first-child");

  svg.classList.toggle("clicked-icon"); // Toggles a class that fills/un-fills the vector
};
