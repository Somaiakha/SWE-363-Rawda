const express = require("express");
const router = express.Router();

const {
  getStore,
  updateStore
} = require("../controllers/storeController");

router.get("/", getStore);
router.put("/", updateStore);

module.exports = router;