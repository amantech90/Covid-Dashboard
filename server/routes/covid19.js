const express = require("express");
const router = express.Router();
const {
  addCountry,
  addCases,
  updateCases,
  getStateData,
  getCountrywiseData,
  getAllStateData
} = require("../controller/covid19");
router.post("/addCountry", addCountry);
router.post("/addCases", addCases);
router.post("/updateCases", updateCases);
router.get("/getStateData/:countryName/:stateName", getStateData);
router.get("/getCountrywiseData/:countryName", getCountrywiseData);
router.get("/getAllStateData/:countryName", getAllStateData);
module.exports = router;
