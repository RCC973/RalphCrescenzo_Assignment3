/**
 * Created by bdalgaard on 10/19/2016.
 */

var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID;
    mongo = require('mongodb');

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server);
BSON = mongo.BSONPure;


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'test' database");
        db.collection('restaurants', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'restaurants' collection doesn't exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving restaurant: ' + id);
    db.collection('restaurants', function(err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('Retrieving all restaurants');
    db.collection('restaurants', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addRestaurants = function(req, res) {
    var restaurant = req.body;
    console.log('Adding new restaurant: ' + JSON.stringify(restaurant));
    db.collection('restaurants', function(err, collection) {
        collection.insert(restaurant, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateRestaurants = function(req, res) {
    var id = req.params.id;
    var restaurant = req.body;
    console.log('Updating restaurant: ' + id);
    console.log(JSON.stringify(restaurant));
    db.collection('restaurants', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, restaurant, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating restaurant: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(restaurant);
            }
        });
    });
}

exports.deleteRestaurants = function(req, res) {
    var id = req.params.id;
    console.log('Deleting restaurant: ' + id);
    db.collection('restaurants', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}