function getArgumentValue(argument) {
  let valueOfArgument = process.argv[process.argv.indexOf(argument) + 1];

  if (process.argv.indexOf(argument) > -1) {
    if (valueOfArgument !== undefined && !valueOfArgument.indexOf("-") == 0) {
      return valueOfArgument;
    }
    console.error("Please pass a value for", argument);
    return false;
  }
}

module.exports = getArgumentValue;
