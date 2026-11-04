// Helpers for reading input from the user.

import readline from "readline-sync";

// Keeps asking until the user types something that is not empty.
export function askRequired(question) {
  while (true) {
    const answer = readline.question(question).trim();

    if (answer !== "") {
      return answer;
    }

    console.log("This field cannot be empty.");
  }
}

// Keeps asking until the user types a whole number greater than 0.
// If a fallback is given, pressing Enter returns it.
export function askPositiveInt(question, fallback) {
  while (true) {
    const answer = readline.question(question).trim();

    if (answer === "" && fallback !== undefined) {
      return fallback;
    }

    const number = Number(answer);

    if (Number.isInteger(number) && number > 0) {
      return number;
    }

    console.log("Please enter a whole number greater than 0.");
  }
}
