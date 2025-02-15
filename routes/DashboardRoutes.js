const { getDashboardCardsData } = require("../controllers/DashboardController");
const auth = require("../middlewares/Auth");

const router = require("express").Router();

router.get("/", auth, getDashboardCardsData);

module.exports = router;
