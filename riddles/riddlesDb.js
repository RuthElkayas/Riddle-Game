// CRUD functions for the riddles database (riddles/db.txt).

import { readArray, writeArray, nextId } from "../utils/fileDb.js";

const DB_FILE = new URL("./db.txt", import.meta.url);

export const LEVELS = ["easy", "medium", "hard"];

export const DEFAULT_LEVEL = "easy";

export const DEFAULT_TIME_LIMIT = 30;

// Riddles without a difficulty or a time limit get the default values,
// so they can still be played.
export function getAllRiddles() {
  return readArray(DB_FILE).map((riddle) => ({
    ...riddle,
    difficulty: riddle.difficulty ?? DEFAULT_LEVEL,
    timeLimit: riddle.timeLimit ?? DEFAULT_TIME_LIMIT,
  }));
}

export function getRiddleById(id) {
  return getAllRiddles().find((riddle) => riddle.id === id);
}

export function addRiddle(riddleData) {
  const riddles = getAllRiddles();

  const newRiddle = { id: nextId(riddles), ...riddleData };

  riddles.push(newRiddle);

  writeArray(DB_FILE, riddles);

  return newRiddle;
}

// Returns the updated riddle, or null if the id does not exist.
export function updateRiddle(id, changes) {
  const riddles = getAllRiddles();

  const riddle = riddles.find((r) => r.id === id);

  if (!riddle) {
    return null;
  }

  Object.assign(riddle, changes);

  writeArray(DB_FILE, riddles);

  return riddle;
}

// Returns the deleted riddle, or null if the id does not exist.
export function deleteRiddle(id) {
  const riddles = getAllRiddles();

  const index = riddles.findIndex((r) => r.id === id);

  if (index === -1) {
    return null;
  }

  const [deleted] = riddles.splice(index, 1);

  writeArray(DB_FILE, riddles);

  return deleted;
}
