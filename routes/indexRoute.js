const router = require('express').Router();
const admin = require("./adminRoute/adminRoute");
const master = require('./masterRoute/masterRoute');
const appWeb = require('./appWebSettingRoute/appWebSettingRoute')
const content = require('./contentRoute/contentRoute');
const review = require('./reviewRoute/reviewRoute');
const vendor = require('./vendorRoute/vendorRoute');
const user = require('./userRoute/userRoute');
const filter=require('./filter/filterRoute')

router.use('/admin', admin)

router.use('/master', master)

router.use('/appWeb', appWeb)

router.use('/content', content)

router.use('/review', review)

router.use('/vendor', vendor)

router.use('/user', user)

router.use('/filter',filter)

module.exports = router;    