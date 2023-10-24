// Module imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Firebase Realtime DB setup
const appSettings = {
  databaseURL:
    "https://we-are-the-champions-20eb9-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endoresementsInDB = ref(database, "endorsements");

const endorsementInput = document.querySelector("#endorsement-input");
const fromInput = document.querySelector("#from-input");
const toInput = document.querySelector("#to-input");
const endorsementList = document.querySelector("#endorsement-cards__list");
const publishBtn = document.querySelector("#publish-btn");

// Function that pushes the endorsement object to the DB
const addEndorsementToDB = () => {
  const endorsementInputValue = endorsementInput.value;
  const fromInputValue = fromInput.value;
  const toInputValue = toInput.value;

  const endorsement = {
    message: endorsementInputValue,
    from: fromInputValue,
    to: toInputValue,
  };

  push(endoresementsInDB, endorsement);
};

// Function that runs the callback on changes to the DB reference
onValue(endoresementsInDB, (snapshot) => {
  if (snapshot.exists()) {
    const snapshotValue = snapshot.val();
    const snapshotValueArray = Object.values(snapshotValue);

    renderCards(snapshotValueArray);
  } else {
    endorsementList.textContent = "No endorsements yet";
  }
});

// Function that renders the endorsement cards
const renderCards = (array) => {
  clearList();

  const cards = array.map((obj) => {
    return createCard(obj);
  });

  cards.forEach((card) => endorsementList.append(card));

  clearInputs();
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

toInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addEndorsementToDB();
  }
});

publishBtn.addEventListener("click", () => {
  addEndorsementToDB();
});
