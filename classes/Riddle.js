// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
// - difficulty
// - timeLimit (seconds)
// - hint (optional)
//
// Method:
// - ask(readline)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using readline
//   - if the player types 'hint', show the hint and add a penalty (only the first time)
//   - keep asking until the answer is correct
//   - if the player took longer than timeLimit, add a penalty
//   - return the total penalty in seconds

const HINT_PENALTY = 10;

const TIME_PENALTY = 5;

export default class Riddle {
  constructor(riddleData) {
    this.id = riddleData.id;

    this.name = riddleData.name;

    this.taskDescription = riddleData.taskDescription;

    this.correctAnswer = riddleData.correctAnswer;

    this.difficulty = riddleData.difficulty;

    this.timeLimit = riddleData.timeLimit;

    this.hint = riddleData.hint;
  }

  ask(readline) {
    console.log(
      `\nRiddle ${this.id}: ${this.name} (time limit: ${this.timeLimit} seconds)`,
    );

    if (this.hint) {
      console.log(
        `Type 'hint' to receive a clue (adds ${HINT_PENALTY} seconds penalty)`,
      );
    }

    const start = Date.now();

    let penalty = 0;

    let hintUsed = false;

    while (true) {
      const userAnswer = readline.question(`${this.taskDescription} ->`).trim().toLowerCase();

      if (userAnswer === "hint") {
        if (!this.hint) {
          console.log("No hint for this riddle.");

          continue;
        }

        console.log(`Hint: ${this.hint}`);

        if (!hintUsed) {
          hintUsed = true;

          penalty += HINT_PENALTY;

          console.log(`${HINT_PENALTY} seconds penalty applied.`);
        }

        continue;
      }

      if (userAnswer === this.correctAnswer.trim().toLowerCase()) {
        console.log("Correct!");

        break;
      } else {
        console.log("Wrong, try again.");
      }
    }

    const elapsedSeconds = (Date.now() - start) / 1000;

    if (elapsedSeconds > this.timeLimit) {
      console.log(`Too slow! ${TIME_PENALTY} seconds penalty applied.`);

      penalty += TIME_PENALTY;
    }

    return penalty;
  }
}
