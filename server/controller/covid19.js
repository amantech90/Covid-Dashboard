const asyncHandler = require("../middleware/async");
const CovidCollection = require("../model/Covid19");
const ErrorResponse = require("../utils/errorResponse");
const CasesCollection = require("../model/Cases");
const { getData, dateOperations } = require("../utils/helper");
const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
const endOfDay = new Date(
  new Date().setUTCHours(23, 59, 59, 999)
).toISOString();

exports.addCountry = asyncHandler(async (req, res, next) => {
  const { countryName } = req.body;
  const covid = await CovidCollection.findOne({ countryName: countryName });
  if (covid) {
    return next(new ErrorResponse("Country name is already exists", 401));
  }
  const newCountry = await CovidCollection({
    countryName: countryName
  });

  await newCountry.save();
  res.status(200).json({
    status: true,
    message: "Successfully created!"
  });
});

exports.addCases = asyncHandler(async (req, res, next) => {
  const { countryName } = req.body;
  const covid = await CovidCollection.findOne({ countryName: countryName });
  if (!covid) {
    return next(
      new ErrorResponse(
        `Country doesn't exist, Please add by POST request to /addCountry`,
        404
      )
    );
  }
  const json = await getData();
  let stateWiseData = json["statewise"];
  let queryObj = {};

  queryObj.createdAt = {
    $gte: startOfDay, // 2019-11-08T00:00:00.000Z
    $lt: endOfDay // 2019-11-08T23:59:59.999Z
  };
  queryObj.countryId = covid._id;
  for (let i = 1; i < stateWiseData.length; i++) {
    let data = {
      stateName: stateWiseData[i].state,
      activeCases: stateWiseData[i].active,
      totalNoOfDeath: stateWiseData[i].deaths,
      noOfRecovered: stateWiseData[i].recovered,
      countryId: covid._id
    };
    queryObj.stateName = stateWiseData[i].state;
    const cases = await CasesCollection.findOne(queryObj);
    if (cases) {
      return next(new ErrorResponse(`Please update the cases number`, 401));
    }
    const newcase = await CasesCollection.create(data);
    covid.cases.push({ caseObjectId: newcase._id });
    await covid.save();
  }
  res.status(200).json({ message: "successfully added!" });
});

exports.updateCases = asyncHandler(async (req, res, next) => {
  const { countryName, data } = req.body;
  const covid = await CovidCollection.findOne({ countryName: countryName });
  if (!covid) {
    return next(
      new ErrorResponse(
        `Country doesn't exist, Please add by POST request to /addCountry`,
        404
      )
    );
  }
  let queryObj = {};
  const json = await getData();
  let stateWiseData = json["statewise"];
  queryObj.createdAt = {
    $gte: startOfDay, // 2019-11-08T00:00:00.000Z
    $lt: endOfDay // 2019-11-08T23:59:59.999Z
  };
  queryObj.countryId = covid._id;
  for (let i = 1; i < stateWiseData.length; i++) {
    let data = {
      activeCases: stateWiseData[i].active,
      totalNoOfDeath: stateWiseData[i].deaths,
      noOfRecovered: stateWiseData[i].recovered
    };
    queryObj.stateName = stateWiseData[i].state;
    await CasesCollection.findOneAndUpdate(queryObj, data, {
      new: true,
      runValidators: true
    });
  }
  res.status(200).json({
    success: true,
    message: "Successfully updated!"
  });
});

exports.getStateData = asyncHandler(async (req, res, next) => {
  const { countryName, stateName } = req.params;
  const covid = await CovidCollection.findOne({ countryName: countryName });
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  if (!covid) {
    return next(
      new ErrorResponse(
        `Country doesn't exist, Please add by POST request to /addCountry`,
        404
      )
    );
  }
  let query = {};
  query.stateName = stateName;
  query.countryId = covid._id;

  const cases = await CasesCollection.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: "$_id",
        totalNoOfDeath: { $sum: "$totalNoOfDeath" },
        seriousCases: { $sum: "$seriousCases" },
        noOfRecovered: { $sum: "$noOfRecovered" },
        activeCases: { $first: "$activeCases" },
        stateName: { $first: "$stateName" },
        totalCases: {
          $sum: {
            $add: ["$totalNoOfDeath", "$activeCases", "$noOfRecovered"]
          }
        },
        lastupdatedtime: { $first: "$updatedAt" }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]);
  if (cases.length <= 0) {
    return next(new ErrorResponse("Data is not found", "404"));
  }
  cases[0].lastupdatedtime = dateOperations(
    cases[0].lastupdatedtime,
    "minute",
    330
  );
  res.status(200).json({
    message: "Successfully get",
    status: true,
    cases: cases[0]
  });
});

exports.getCountrywiseData = asyncHandler(async (req, res, next) => {
  const { countryName } = req.params;
  if (countryName.toLowerCase() !== "india") {
    return next(new ErrorResponse("Only India data is available", 404));
  }
  const json = await getData();
  const countryWise = json["statewise"];
  console.log(countryWise[0]);
  let newDate = countryWise[0].lastupdatedtime.split("/");
  let correctDate =
    newDate[2].split(" ")[0] +
    "-" +
    newDate[1] +
    "-" +
    newDate[0] +
    "T" +
    newDate[2].split(" ")[1] +
    "Z";
  let data = {
    stateName: countryWise[0].state,
    confirmed: countryWise[0].confirmed,
    totalNoOfDeath: countryWise[0].deaths,
    noOfRecovered: countryWise[0].recovered,
    countryId: countryName,
    delta: countryWise[0].delta,
    lastupdatedtime: dateOperations(correctDate, "minute", -330)
  };
  console.log(data);
  res.status(200).json({ status: true, data });
});

exports.getAllStateData = asyncHandler(async (req, res, next) => {
  const { countryName } = req.params;
  const covid = await CovidCollection.findOne({ countryName });
  if (!covid) {
    return next(new ErrorResponse("Country name is not valid", 404));
  }
  const json = await getData();
  const stateWiseData = json["statewise"];
  let newData = stateWiseData;
  newData.sort(compareBy("state"));
  res.status(200).json({
    status: true,
    message: "successfully get!",
    data: newData
  });
});

function compareBy(key) {
  return function(a, b) {
    if ("" + a[key] < "" + b[key]) return -1;
    if ("" + a[key] > "" + b[key]) return 1;
    return 0;
  };
}
