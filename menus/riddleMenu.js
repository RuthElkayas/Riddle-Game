// The screens for the riddle CRUD options in the main menu.

import readline from "readline-sync";

import {
  LEVELS,
  DEFAULT_LEVEL,
  DEFAULT_TIME_LIMIT,
  getAllRiddles,
  getRiddleById,
  addRiddle,
  updateRiddle,
  deleteRiddle,
} from "../riddles/riddlesDb.js";


import { askRequired, askPositiveInt } from "../utils/input.js";

// Keeps asking until the user types a valid level.
// Pressing Enter returns the fallback value.
function askLevel(question, fallback) {
  while (true) {
    const level = readline.question(question).trim().toLowerCase();

    if (level === "") {
      return fallback;
    }

    if (LEVELS.includes(level)) {
      return level;
    }

    console.log("Invalid choice, please type easy, medium or hard.");
  }
}

function printRiddle(riddle) {
  console.log(`\n#${riddle.id} ${riddle.name} (${riddle.difficulty}, ${riddle.timeLimit} seconds)`);

  console.log(`  Description: ${riddle.taskDescription}`);

  console.log(`  Answer: ${riddle.correctAnswer}`);

  if (riddle.hint) {
    console.log(`  Hint: ${riddle.hint}`);
  }
}

export function createRiddleMenu() {
  const name = askRequired("Enter riddle name: ");

  const taskDescription = askRequired("Enter description: ");

  const correctAnswer = askRequired("Enter correct answer: ");

  const difficulty = askLevel(`Enter difficulty - easy / medium / hard (Enter for ${DEFAULT_LEVEL}): `, DEFAULT_LEVEL);

  const timeLimit = askPositiveInt(`Enter time limit in seconds (Enter for ${DEFAULT_TIME_LIMIT}): `, DEFAULT_TIME_LIMIT);

  const hint = readline.question("Enter hint (Enter to skip): ").trim();

  const riddleData = { name, taskDescription, correctAnswer, difficulty, timeLimit };

  if (hint !== "") {
    riddleData.hint = hint;
  }

  const riddle = addRiddle(riddleData);

  console.log(`Riddle "${riddle.name}" saved with id ${riddle.id}.`);
}

export function readRiddlesMenu() {
  const riddles = getAllRiddles();

  if (riddles.length === 0) {
    console.log("There are no riddles yet.");

    return;
  }

  riddles.forEach(printRiddle);
}

export function updateRiddleMenu() {
  const id = askPositiveInt("Enter the id of the riddle to update: ");

  const riddle = getRiddleById(id);

  if (!riddle) {
    console.log(`No riddle with id ${id}.`);

    return;
  }

  printRiddle(riddle);

  console.log("\nPress Enter to keep the current value.");

  const keepOrChange = (label, current) => readline.question(`${label} [${current}]: `).trim() || current;

  const changes = {
    name: keepOrChange("Name", riddle.name),
    taskDescription: keepOrChange("Description", riddle.taskDescription),
    correctAnswer: keepOrChange("Correct answer", riddle.correctAnswer),
    difficulty: askLevel(`Difficulty [${riddle.difficulty}]: `, riddle.difficulty),
    timeLimit: askPositiveInt(`Time limit [${riddle.timeLimit}]: `, riddle.timeLimit),
    hint: keepOrChange("Hint", riddle.hint ?? ""),
  };

  if (changes.hint === "") {
    delete changes.hint;
  }

  updateRiddle(id, changes);

  console.log(`Riddle ${id} updated.`);
}

export function deleteRiddleMenu() {
  const id = askPositiveInt("Enter the id of the riddle to delete: ");

  const deleted = deleteRiddle(id);

  if (deleted) {
    console.log(`Riddle "${deleted.name}" deleted.`);
  } else {
    console.log(`No riddle with id ${id}.`);
  }
}
