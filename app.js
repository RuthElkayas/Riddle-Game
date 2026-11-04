// Entry point of the game. Run it with: node app.js
//
// This file shows the main menu and runs the action the user chose,
// until the user chooses to exit.

import readline from "readline-sync";

import playGame from "./game/playGame.js";

import {
  createRiddleMenu,
  readRiddlesMenu,
  updateRiddleMenu,
  deleteRiddleMenu,
} from "./menus/riddleMenu.js";

import { getLeaderboard } from "./players/playersDb.js";

function showLeaderboard() {
  const players = getLeaderboard();

  if (players.length === 0) {
    console.log("No recorded times yet.");

    return;
  }

  console.log("\n🏆 Leaderboard:");

  players.forEach((player, index) => {
    console.log(`${index + 1}. ${player.name} - ${player.lowestTime} seconds`);
  });
}

const ACTIONS = {
  1: playGame,
  2: createRiddleMenu,
  3: readRiddlesMenu,
  4: updateRiddleMenu,
  5: deleteRiddleMenu,
  6: showLeaderboard,
};

function showMenu() {
  console.log("\nWhat do you want to do?");
  console.log("1. Play the game");
  console.log("2. Create a new riddle");
  console.log("3. Read all riddles");
  console.log("4. Update an existing riddle");
  console.log("5. Delete a riddle");
  console.log("6. View leaderboard");
  console.log("0. Exit");
}

function main() {
  while (true) {
    showMenu();

    const choice = readline.question("Your choice: ").trim();

    if (choice === "0") {
      console.log("Goodbye!");

      return;
    }

    const action = ACTIONS[choice];

    if (!action) {
      console.log("Invalid choice, please type a number from the menu.");

      continue;
    }

    try {
      action();
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

main();
