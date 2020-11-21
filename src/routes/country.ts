import *  as countriesData from '../resources/countries.json';
const express = require('express');
const router = express.Router();

router.get('/', async(req, res)=>{
    let countries = [];
    for(let i in countriesData){
        const data = {
            name: countriesData[i].name,
            value: countriesData[i].alpha2Code,
            callingCodes: countriesData[i].callingCodes,
            flag: countriesData[i].flag,
        }
        countries.push([i , data])
    }
    res.json({
        status: 200,
        success: true,
        countries: countries
    })
    
    // countriesData.every(function(country){
    //     console.log(country);
    // })
    // countriesData.forEach(function(country){
    //     console.log(country);
    // })
    // [...countriesData].forEach(country => {
    //     console.log(country);
    // })
    // for( const country of countriesData){
    //     console.log(country);
    // }
//console.log(Array.from(countriesData))
// .forEach(country => {
// console.log('foreache');
//     })
    // Array.prototype.forEach.call(countriesData,country => {
    //     console.log('country');
        // const data = {
        //     name: country.name,
        //     value: country.alpha2Code,
        //     callingCodes: `+${country.callingCodes[0]}`,
        //     flag: country.flag
        // }
        // console.log(country);
        // countries.push(data);
    //});
    // res.json({
    //     status: 200,
    //     success: true,
    //     countries: countries
    // });
    
//     countriesData.forEach(country => {
//         const data = {
//             name: country.name,
//             value: country.alpha2Code,
//             callingCodes: `+${country.callingCodes[0]}`,
//             flag: country.flag
//         }
//         countries.push(data);

//     });
//     console.log('get countries');
//    res.json({
//        status: 200,
//        success: true,
//        countries: countries
//    })
});

module.exports = router;
