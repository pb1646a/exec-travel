const express = require("express");
const router = express.Router();
const sabre = require("../controllers/sabre");
const baseUrl = `https://api.test.sabre.com`;

router.get("", (req, res, next) => {
  sabre
    .get("/v1/lists/supported/cities")
    .then(response => {
      console.log(response);
      let cities = response.data.Cities;
      let citiesObj = cities.map(async city => {
        let transport = await Promise.all(
          city.Links.map(link => {
            return getAirport(link["href"]);
          })
        );
        return {
          type: "city",
          name: city.name,
          code: city.code,
          transport: transport
        };
      });
      Promise.all(citiesObj).then(cities => {
        let resp = cities.map(cities => cities)
        res.status(200).json({ message: "ok", data: resp });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/promotions", (req, res, next) => {
  sabre
    .get("/v1/lists/supported/shop/themes/{theme}")
    .then(
      resp => {
        return res.status(200).json({ message: "success", data: resp.data });
      },
      error => {
        console.log("error is not thrown yet");
      }
    )
    .catch(err => {
      console.log("error");
    });
});
router.get("/instant", (req, res, next) => {
  let params = {
    origin: req.query.departure,
    destination: req.query.destination,
    departuredate: req.query.departuredate,
    returndate: req.query.returndate,
    passengercount: req.query.passengercount

    // limit: 1
  };
  sabre
    .get("/v1/shop/flights", params)
    .then(
      resp => {
        return res.status(200).json({ message: "success", data: resp.data });
      },
      error => {
        if (error.statusCode !== 500 || error.statusCode !== 401) {
          return res.status(200).json({ message: error.message});
        } else {
          throw new Error(JSON.stringify(error));
        }
      }
    )
    .catch(err => {
      console.log(err);
      return err;
    });
});

function getAirport(link) {
  let updatedUrl = link.replace(baseUrl, "");
  return sabre.get(updatedUrl).then(transport=> transport.data, error=>{
    if (error.statusCode !== 500 || error.statusCode !== 401) {
      return res.status(200).json({ message: error.message});
    } else {
      throw new Error(JSON.stringify(error));
    }

  });
}

module.exports = router;
