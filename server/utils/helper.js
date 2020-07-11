const fetch = require("node-fetch");
const asyncHandler = require("../middleware/async");
exports.getData = asyncHandler(async function() {
  const response = await fetch("https://api.covid19india.org/data.json", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  const json = await response.json();
  return json;
});

exports.dateOperations = function(date, interval, units) {
  var ret = new Date(date);
  var checkRollover = function() {
    if (ret.getDate() != date.getDate()) ret.setDate(0);
  };
  switch (interval.toLowerCase()) {
    case "year":
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case "quarter":
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case "month":
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case "week":
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case "day":
      ret.setDate(ret.getDate() + units);
      break;
    case "hour":
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case "minute":
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case "second":
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      ret = undefined;
      break;
  }
  return ret;
};
