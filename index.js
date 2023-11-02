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
  const errorText = document.querySelector("#error-text");

  if ((endorsementInputValue, fromInputValue, toInputValue)) {
    const endorsementInputValue = endorsementInput.value;
    const fromInputValue = fromInput.value;
    const toInputValue = toInput.value;

    errorText.classList.add("hidden");

    createEndorsementObj(endorsementInputValue, fromInputValue, toInputValue);
  } else {
    errorText.classList.remove("hidden");
  }
};

// Creates a new object to contain the captured input field values
const createEndorsementObj = (endorsementVal, fromVal, toVal) => {
  const endorsement = {
    message: endorsementVal,
    from: fromVal,
    to: toVal,
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
  card.innerHTML += cardContents;
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
};
