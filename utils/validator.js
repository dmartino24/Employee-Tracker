const validator = require("validator");

const validate = {
  validateString(str) {
    return str !== "" || "Please enter a valid response.";
  },
  validateSalary(num) {
    if (validator.isDecimal(num)) return true;
    return "Please enter a valid salary.";
  },
};

module.exports = validate;
