const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://192.168.43.16:27017';

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db('info');
    const collection = db.collection('vid')
    // collection.find({popjav_code:/tokyo/i,title:/hot/i})
    // collection.find({ popjav_code: /carib/i,}).count(console.log)
    const counterUpdater = (c) => {
        console.log(c);
        c++
        return c
    }
    let counter = 0
    collection.aggregate([{
        $group: {
            _id: { link: '$popjav_code' },
            count: { $sum: 1 }
        }
    }, {
        $match: {count:{ $gt: 25} }
    }]).forEach(console.log)
    // client.close();
});
