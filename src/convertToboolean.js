function convertToboolean(stringBoolean) {
  if (stringBoolean) {
    if (stringBoolean.indexOf("true") > -1) {
      return true;
    }
  }
  return false;
}
module.exports = convertToboolean;
