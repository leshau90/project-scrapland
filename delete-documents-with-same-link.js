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
    collection.aggregate([{
        $group: {
            _id: { link: '$popjav_link' },
            count: { $sum: 1 }
        }

    }, {
        $match: { count: { $gt: 1 } }
    }]
    ).forEach(cdoc => {
        console.log(`will be deleting ${cdoc.count-1} of ${cdoc._id.link}`)
        collection.find({ popjav_link: cdoc._id.link }).limit(cdoc.count - 1)
            .forEach(ddoc => {
                collection.deleteOne({ _id: ddoc._id }, (err, res) => {
                    if (err) console.log(`cannot delete  ${ddoc._id} with id ${ddoc.popjav_link}`)
                    else console.log(`DELETED ${ddoc._id} with link: ${ddoc.popjav_link}`)
                })
            })
    }
    )

});
//fix if the number is copied multiple times
// console.log(doc.popjav_code, '==>',`${doc.popjav_code.trim()} ${add[0]}`)
        // let codeArr = doc.popjav_code.split(' ')
        // let shortened = codeArr[0] + ' ' + codeArr[1]
        // collection.updateOne({ _id: doc._id }, { $set: { popjav_code: shortened } }, (err, result) => console.log(result.modifiedCount))