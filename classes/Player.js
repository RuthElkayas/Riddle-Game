// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle, including penalties)
//
// Methods:
// - recordTime(start, end, penalty)
//   - calculate the duration (end - start), add the penalty seconds, and add it to the times array
// - getTotalTime()
//   - return the sum of the times array
// - showStats()
//   - show the total time and the average time per riddle


export default class Player {
  constructor(name, times = []) {
    this.name = name;

    this.times = times;
  }

  recordTime(start, end, penalty = 0) {
    const durationInSeconds = Math.round((end - start) / 1000) + penalty;

    this.times.push(durationInSeconds);
  }

  getTotalTime() {
    return this.times.reduce((acc, curr) => acc + curr, 0);
  }

  showStats() {
    if (this.times.length === 0) {
      console.log(`\nNo riddles were solved, ${this.name}.`);

      return;
    }

    const totalTime = this.getTotalTime();

    const averageTime = Math.round(totalTime / this.times.length);

    console.log(`\nGreat job, ${this.name}!`);

    console.log(`Your time: ${totalTime} seconds`);

    console.log(`Average per riddle: ${averageTime} seconds`);
  }
}
