const express = require("express");
const{ protect , adminOnly} = require( "../middlewares/authMiddleware");

const router  = express.Router();

router.get("/export/tasks" , protect, adminOnly , exportTasksReport);
router.get("/export/tasks" , protect, adminOnly , exportUserReport);

module.exports = router;
