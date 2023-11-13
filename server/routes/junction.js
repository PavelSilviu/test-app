const { info } = require('console');

module.exports = app => {
    'use strict';
    const express         = require('express');
    const informationCtrl = require('../controllers/junctionCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/:personId/cars/', informationCtrl.create);
    router.get('/:personId/cars/', informationCtrl.find);
    router.put('/:personId/cars/', informationCtrl.update);
    router.delete('/:personId/cars/', informationCtrl.destroyPerson);
    router.delete('/cars/:carId', informationCtrl.destroyCar);
  
    return router;
  };
  