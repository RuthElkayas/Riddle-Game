// Runs one game:
// 1. Checks if there is a saved game and offers to continue or start over.
// 2. For a new game - asks for the player's name and a difficulty level.
// 3. Finds the player in players.txt and shows the time to beat, or adds a new player.
// 4. Loads only the riddles of the chosen level that were not solved yet, and shuffles them.
// 5. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method (it returns the penalty seconds)
//    - save the end time (Date.now())
//    - save the time and penalty using player.recordTime()
//    - save the progress to progress.json
// 6. After the loop, shows the stats, updates the player's lowest time and deletes the saved progress.

import readline from "readline-sync";

import Player from "../classes/Player.js";

import Riddle from "../classes/Riddle.js";

import Progress from "../classes/Progress.js";

import { LEVELS, getAllRiddles } from "../riddles/riddlesDb.js";

import { findPlayerByName, addPlayer, updateLowestTime } from "../players/playersDb.js";

import { askRequired } from "../utils/input.js";

import shuffle from "../utils/shuffle.js";

function chooseLevel() {
  while (true) {
    const level = readline.question("Choose difficulty: easy / medium / hard: ").trim().toLowerCase();

    if (LEVELS.includes(level)) {
      return level;
    }

    console.log("Invalid choice, please type easy, medium or hard.");
  }
}

function loadSavedGame() {
  if (!Progress.exists()) {
    return null;
  }

  const saved = Progress.load();

  if (!saved) {
    return null;
  }

  const answer = readline.question( `Found a saved game for ${saved.name} (${saved.level}, ${saved.solvedIds.length} solved). Continue? (yes/no): `, ).trim().toLowerCase();

  if (answer === "yes" || answer === "y") {
    return saved;
  }

  Progress.clear();

  return null;
}

// Returns the player's record from players.txt. A new player is added to the file.
function greetPlayer(name) {
  const existing = findPlayerByName(name);

  if (!existing) {
    console.log(`Hi ${name}! Good luck on your first game.`);

    return addPlayer(name);
  }

  if (existing.lowestTime === null || existing.lowestTime === undefined) {
    console.log(`Hi ${existing.name}! You don't have a recorded time yet.`);
  } else {
    console.log(`Hi ${existing.name}! Your previous lowest time was ${existing.lowestTime} seconds.`);
  }

  return existing;
}

export default function playGame() {
  console.log("\nWelcome to the Riddle Game!");

  let progress = loadSavedGame();

  let playerRecord;

  if (progress) {
    playerRecord = greetPlayer(progress.name);
  } else {
    playerRecord = greetPlayer(askRequired("What is your name? "));

    const level = chooseLevel();

    progress = { name: playerRecord.name, level, solvedIds: [], times: [] };
  }

  const player = new Player(progress.name, progress.times);

  const riddles = shuffle(
    getAllRiddles().filter((r) => r.difficulty === progress.level && !progress.solvedIds.includes(r.id),
    ),
  );

  for (const riddleData of riddles) {
    const riddle = new Riddle(riddleData);

    const start = Date.now();

    const penalty = riddle.ask(readline);

    const end = Date.now();

    player.recordTime(start, end, penalty);

    progress.solvedIds.push(riddle.id);

    progress.times = player.times;

    Progress.save(progress);
  }

  player.showStats();

  // A game without solved riddles has a time of 0, which must not count as a record.
  if (player.times.length > 0) {
    if (updateLowestTime(playerRecord.id, player.getTotalTime())) {
      console.log("New record! Time updated.");
    } else {
      console.log(`Your lowest time is still ${playerRecord.lowestTime} seconds.`);
    }
  }

  Progress.clear();
}
