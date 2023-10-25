// Module imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Firebase app config & setup
const appSettings = {
  databaseURL:
    "https://we-are-the-champions-20eb9-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings); // Creates Firebase app
const database = getDatabase(app); // Creates database obj
const endorsementListInDB = ref(database, "endorsements"); // Creates reference to database location

// DOM elements
const endorsementInput = document.querySelector("#user-input__endorsement");
const fromInput = document.querySelector("#message-details__from");
const toInput = document.querySelector("#message-details__to");
const endorsementList = document.querySelector("#endorsement__list");
const publishBtn = document.querySelector("#publish-btn");

// Function that captures input values & pushes to the DB
const addEndorsementToDB = () => {
  // Captures all of the current DOM element values
  const endorsementInputValue = endorsementInput.value;
  const fromInputValue = fromInput.value;
  const toInputValue = toInput.value;

  const endorsement = {
    message: endorsementInputValue,
    from: fromInputValue,
    to: toInputValue,
  };

  // Pushes the endorsement obj to the DB
  push(endorsementListInDB, endorsement);
};

// Event listener for 'Enter' key on "To" input field (keyboard users)
toInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addEndorsementToDB();
  }
});

// Event listener for "Publish" btn click
publishBtn.addEventListener("click", () => {
  addEndorsementToDB();
});

// Firebase method that runs the callback function on each update to the DB reference
onValue(endorsementListInDB, (snapshot) => {
  if (snapshot.exists()) {
    const snapshotValue = snapshot.val();
    const snapshotValuesArray = Object.values(snapshotValue);
    const reversedSnapshotArray = snapshotValuesArray.reverse(); // Ensures that the newest endorsement shows first

    renderCards(reversedSnapshotArray);
  } else {
    endorsementList.textContent =
      "No endorsements yet, add a message for your team 🥳";
  }
});

// Function that renders the endorsement cards
const renderCards = (array) => {
  clearList(); // Clears existing list

  const cards = array.map((obj) => {
    return createCard(obj);
  });

  cards.forEach((card) => endorsementList.append(card));

  clearInputs(); // Clear input field values
};

// Function that creates the endorsement cards
const createCard = (obj) => {
  const objEntries = Object.entries(obj);
  const card = document.createElement("li");
  let cardContents = "";

  const cardContentsArray = objEntries.map((entry) => {
    return `<p class="${entry[0]}" id="${entry[0]}">${entry[1]}</p>`;
  });

  cardContentsArray.forEach((item) => {
    cardContents += item;
  });

  card.innerHTML += cardContents;
  card.className = "card flex-column";

  return card;
};

// Clears the endorsements list
const clearList = () => {
  endorsementList.innerHTML = "";
};

// Clears inputs
const clearInputs = () => {
  const inputs = document.querySelectorAll(".text-input");

  inputs.forEach((input) => (input.value = ""));
};
