// Use Express
var express = require("express");
// Use body-parser
var bodyParser = require("body-parser");
// Use MongoDB
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
// The database variable
var database;
// The products collection
var PRODUCTS_COLLECTION = "products";
var TEMPERATURE_COLLECTION = "temperature"

// Create new instance of the express server
var app = express(); 

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory 
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
// Local database URI.
const LOCAL_DATABASE = "mongodb://localhost:27017/captsol";
// Local port.
const LOCAL_PORT = 8080;

// Init the server
mongodb.MongoClient.connect(process.env.MONGODB_URI || LOCAL_DATABASE,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, function (error, client) {

        // Check if there are any problems with the connection to MongoDB database.
        if (error) {
            console.log(error);
            process.exit(1);
        }

        // Save database object from the callback for reuse.
        database = client.db();
        console.log("Database connection done.");

        // Initialize the app.
        var server = app.listen(process.env.PORT || LOCAL_PORT, function () {
            var port = server.address().port;
            console.log("App now running on port", port);
        });
    });

var keys = [
    'Tv1',
  'Tv2',
  'Tv3',
  'Tv4',
  'Tv5',
  'Tab1',
  'Tab2',
  'Tab3',
  'Tab4',
  'Tab5',
  'Te1',
  'Te2',
  'Te3',
  'Ts1',
  'Ts2',
  'Ts3',
  'He1',
  'He2',
  'He3',
  'He4',
  'He5',
  'He6',
];

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});


/** get all temp from the DB */
app.get("/api/temperatures", function(req, res){
    database.collection(TEMPERATURE_COLLECTION).find({}).toArray(function(err, data){
        if (err){
            manageError(res, err.message, "Failed to get temperature try to restart the DB server.");
        }else{
            res.status(200).json(data);
        }
    })
})
/*  "/api/products"
 *  GET: finds all products
 */
app.get("/api/products", function (req, res) {
    database.collection(PRODUCTS_COLLECTION).find({}).toArray(function (error, data) {
        if (error) {
            manageError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(data);
        }
    });
});



/** POST A TEMPERATURE OBJECT SENT FROM THE ESP 12 */
app.post("/api/temperatures", (req, res)=>{
    let data = req.body;
    data.date = new Date()
    // if (checkIfObjectIsCorrect(data)){
        database.collection(TEMPERATURE_COLLECTION).insertOne(data, function (err, doc) {
            if (err) {
                manageError(res, err.message, "Echec d'enregistrement");
            } else {
                res.status(201).json(doc.ops[0]); 
            }
        });
    // }else{
        // manageError(res, "Champs non valides");
    // }
    
});


// checkIfObjectIsCorrect(object){
//     let cpt = -1; // a cause de date qui est ajoute
//     keys.forEach(elt=>{
//         if (object.hasOwnProperty(elt) == true){
//             cpt  = cpt + 1
//         }
//     })

//     if (cpt == keys.length){
//         return true
//     }else{
//         return false
//     }
// }


/*  "/api/products"
 *   POST: creates a new product
 */
app.post("/api/products", function (req, res) {
    // console.log(':::>',req.body);
    var product = req.body;
    product.date = new Date()
    if (!product.name) {
        manageError(res, "Invalid product input", "Name is mandatory.", 400);
    } else if (!product.brand) {
        manageError(res, "Invalid product input", "Brand is mandatory.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).insertOne(product, function (err, doc) {
            if (err) {
                manageError(res, err.message, "Failed to create new product.");
            } else {
                res.status(201).json(doc.ops[0]); 
            }
        });
    }
});

/*  "/api/products/:id"
 *   DELETE: deletes product by id
 */
app.delete("/api/products/:id", function (req, res) {
    if (req.params.id.length > 24 || req.params.id.length < 24) {
        manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
            if (err) {
                manageError(res, err.message, "Failed to delete product.");
            } else {
                res.status(200).json(req.params.id);
            }
        });
    }
});

// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}
