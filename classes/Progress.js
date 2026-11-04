// The Progress class. Export it as the default export.
// Saves the game progress to progress.json so the player can continue later.
//
// The saved data looks like:
// { name, level, solvedIds: [riddle ids], times: [seconds] }
//
// Static methods:
// - exists() - check if a saved game exists
// - load()   - read the saved game (returns null if the file is broken)
// - save(data) - write the progress to the file
// - clear()  - delete the saved game

import fs from "fs";

const PROGRESS_FILE = new URL("../progress.json", import.meta.url);

export default class Progress {
  static exists() {
    return fs.existsSync(PROGRESS_FILE);
  }

  static load() {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    } catch {
      return null;
    }
  }

  static save(data) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
  }

  static clear() {
    if (Progress.exists()) {
      fs.unlinkSync(PROGRESS_FILE);
    }
  }
}
