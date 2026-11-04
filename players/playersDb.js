// Functions for the players database (players/players.txt).
// Each player looks like: { id, name, lowestTime }
// lowestTime is null until the player finishes a game for the first time.

import { readArray, writeArray, nextId } from "../utils/fileDb.js";

const DB_FILE = new URL("./players.txt", import.meta.url);

function hasTime(player) {
  return player.lowestTime !== null && player.lowestTime !== undefined;
}

// The search ignores upper/lower case, so "sarah" and "Sarah" are the same player.
export function findPlayerByName(name) {
  const wanted = name.trim().toLowerCase();

  return readArray(DB_FILE).find((p) => p.name.toLowerCase() === wanted);
}

export function addPlayer(name) {
  const players = readArray(DB_FILE);

  const newPlayer = { id: nextId(players), name: name.trim(), lowestTime: null };

  players.push(newPlayer);

  writeArray(DB_FILE, players);

  return newPlayer;
}

// Saves the time if the player has no time yet, or if it beats the saved one.
// Returns true if the time was saved.
export function updateLowestTime(id, time) {
  const players = readArray(DB_FILE);

  const player = players.find((p) => p.id === id);

  if (!player || (hasTime(player) && time >= player.lowestTime)) {
    return false;
  }

  player.lowestTime = time;

  writeArray(DB_FILE, players);

  return true;
}

// Returns only the players with a recorded time, fastest first.
export function getLeaderboard() {
  return readArray(DB_FILE)
    .filter(hasTime)
    .sort((a, b) => a.lowestTime - b.lowestTime);
}
