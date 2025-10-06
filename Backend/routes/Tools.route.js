const express = require('express');
const { allColleges, allVerifiedColleges } = require('../controllers/toolsController');
const toolsRouter = express.Router();

toolsRouter.get('/colleges', allVerifiedColleges);
// toolsRouter.get('/colleges/all', allColleges);

module.exports = { toolsRouter };
