const express = require("express");
const router = express.Router();

const {
    getExpertApplications,
    updateExpertStatus,
    deleteExpert,
} = require("../controllers/expertController");

router.get("/", getExpertApplications);
router.put("/:id/status", updateExpertStatus);
router.delete("/:id", deleteExpert);

module.exports = router;