//for future installer logging ;)
console.log("Hello");
console.log("This line wont prints");
const clearLastLines = (count) => {
    process.stdout.moveCursor(0, -count)
    process.stdout.clearScreenDown()
  }
  clearLastLines(1);
  console.log("This line prints");