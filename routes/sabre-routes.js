const express = require("express");
const router = express.Router();
const sabre = require("../controllers/sabre");
const baseUrl = `https://api.test.sabre.com`;

router.get("", (req, res, next) => {
  sabre
    .get("/v1/lists/supported/cities")
    .then(response => {
   
      let cities = response.data.Cities;
      let citiesObj = cities.map(async city => {
        let airports = await Promise.all(
          city.Links.map(link => {
            return getAirport(link["href"]);
          })
        );
        return {
          type: "city",
          name: city.name,
          code: city.code,
          transport: airports
        };
      });
      Promise.all(citiesObj).then(cities => {
        let response = cities.map(cities => cities);
        res.status(200).json({ message: "ok", data: response });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/promotions", (req, res, next) => {
  sabre
    .get("/v1/lists/supported/shop/themes/{theme}")
    .then(resp => {
      return res.status(200).json({ message: "success", data: resp.data });
    })
    .catch(err => {
      console.log(err);
    });
});
router.get("/instant", (req, res, next) => {
  let params = {
    origin: req.query.departure,
    destination: req.query.destination,
    departuredate:  req.query.departuredate,
    returndate: req.query.returndate,
    passengercount: req.query.passengercount

    // limit: 1
  };
  sabre
    .get("/v1/shop/flights", params)
    .then(resp => {

      return res.status(200).json({ message: "success", data: resp.data });
    })
    .catch(err => {
      return err;
    })
});

function getAirport(link) {
  let updatedUrl = link.replace(baseUrl, "");
  return sabre.get(updatedUrl).then(response => {
    return response.data;
  });
}

module.exports = router;
