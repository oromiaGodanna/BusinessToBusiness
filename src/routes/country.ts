import *  as countriesData from '../resources/countries.json';
const express = require('express');
const router = express.Router();

router.get('/', async(req, res)=>{
    let countries = [];
    
    countriesData.forEach(country => {
        const data = {
            name: country.name,
            value: country.alpha2Code,
            callingCodes: `+${country.callingCodes[0]}`,
            flag: country.flag
        }
        countries.push(data);

    });
    console.log('get countries');
   res.json({
       status: 200,
       success: true,
       countries: countries
   })
});

module.exports = router;
