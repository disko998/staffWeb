const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GeoFirestore } = require("geofirestore");
const collection = "jobs";

////////////////////////////////////////////////
////////////// MAIN FUNCTIONS ///////////////
//////////////////////////////////////////////

/**
 *  @desc Filter key "area" to locate all items within the defined area. Expects format { "area": { "radius": int, "point": array, "uom": string}}
 * @param {Request} req
 * @param {Object} req.query.$filters // filters for the query
 * @param {Object} req.query.$filters.area // area object
 * @param {Number} req.query.$filters.area.radius // radius in km
 * @param {String} req.query.$filters.area.uom // either of km or mi
 * @param {Array<latitude, longitude>} req.query.$filters.area.point
 */
exports.getBasedOnGeoLocation = functions.https.onRequest((req, res) => {
  if (req.method === "GET") {
    let filters = JSON.parse(req.query.$filters);

    console.log(filters);

    if (_isValidAreaFilter(filters)) {
      const area = filters.area;
      const geofirestore = new GeoFirestore(admin.firestore());
      return geofirestore
        .collection(collection)
        .near({
          center: new admin.firestore.GeoPoint(area.point[0], area.point[1]),
          radius: _radiusInKm(area)
        })
        .get()
        .then(
          value => {
            // All GeoDocument returned by GeoQuery, like the GeoDocument added above
            const docs = value.docs.filter(doc => {
              //console.log(doc);
              doc["data"] = doc["data"]();
              doc.data.id = doc.id;

              if (new Date() < new Date(doc.data.date)) {
                console.log("Inside ");
                console.log(doc);

                return doc;
              }
            });

            return res.status(200).send(docs);
          },
          error => {
            return res.status(500).json({
              message: error.message
            });
          }
        );
    } else {
      return res.status(400).json({
        message: "Invalid Filters provided"
      });
    }
  } else {
    return res.status(500).json({
      message: "Invalid Request"
    });
  }
});

/**
 * @desc Add name, price and point to the firestore database
 * @param {Request} req
 * @param {Object} req.body.data
 * @param {String} req.body.data.name
 * @param {Array<latitude, longitude>} req.body.data.point
 * @param {Number} req.body.data.price
 */

exports.saveJobs = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    res.set("Access-Control-Allow-Origin", "*");
    const data = JSON.parse(req.body);
    const geofirestore = new GeoFirestore(admin.firestore());

    const jobs = createJobFromJobs(data.slots, {
      jobNo: data.jobNo,
      name: data.name,
      site: data.site,
      dep: data.dep,
      cost: data.cost,
      type: data.type,
      uid: data.uid,
      agencyName: data.agencyName,
      // The coordinates field must be a GeoPoint!
      coordinates: new admin.firestore.GeoPoint(data.latitude, data.longitude)
    });

    console.log(jobs);
    let promises = [];

    jobs.forEach(j => {
      promises.push(geofirestore.collection(collection).add(j));
    });

    return Promise.all(promises)
      .then(response => {
        // const docs = response.map((doc) => {
        //   doc['data'] = doc['data']();
        //   return doc;
        // });
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(400).json({
          message: err.message
        });
      });
  } else {
    return res.status(500).json({
      message: "Invalid Request"
    });
  }
});

////////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
//////////////////////////////////////////////

const _isValidAreaFilter = filters => {
  return (
    filters &&
    typeof filters.area === "object" &&
    filters.area.hasOwnProperty("radius") &&
    filters.area.hasOwnProperty("uom") &&
    filters.area.hasOwnProperty("point")
  );
};

const _radiusInKm = area => {
  switch (area.uom.toLowerCase()) {
    case "miles":
    case "mile":
    case "mi":
    case "m":
      return area.radius * 1.60934;
    case "kilometers":
    case "kilometer":
    case "km":
    case "k":
      return area.radius;
    default:
      return area.radius;
  }
};

const createJobFromJobs = (slots, otherInfo) => {
  return Object.keys(slots).map(s => {
    console.log(slots[s]);
    return {
      ...otherInfo,
      date: s,
      times: slots[s]
    };
  });
};
