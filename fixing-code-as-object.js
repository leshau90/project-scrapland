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
    
    
    collection.find({ 'popjav_code.popjav_code': {$exists:1} }).forEach((doc) => {
        // console.log('tobeupdated',counter)

            // console.log(doc.popjav_code, doc.title)
        // let add = doc.title.split(' ').slice(1, 3)
        // console.log(doc.popjav_code,'to', split4Fixer(doc))

        collection.updateOne({ _id: doc._id }, { $set: { popjav_code: doc.popjav_code.popjav_code} },
            (err, result) => console.log('MODIFY', result.ops, doc.popjav_code))
        // collection.updateOne({ _id: doc._id }, { $set: split1Fixer(doc) },
        //     (err, result) => console.log(`MODIFY ${result.modifiedCount}, ${doc.popjav_code} to ${split1Fixer(doc).popjav_code}`))
        // collection.deleteOne({_id:doc._id},()=>client.close())
        // ()=>client.close()

    })

    // client.close();
});
//for heyz,1pon,paco carib s-cute sdelta heydouga
function split1Fixer(doc) {
    let add = doc.title.split(' ').slice(1, 3)
    return { popjav_code: `${doc.popjav_code.trim()} ${add[0]}` }
}

//for 10 mu
function split2Fixer(doc) {
    let add = doc.title.split(' ').slice(1, 3)
    return { popjav_code: `${doc.popjav_code.trim()} ${add[0]} ${add[1]}` }
}
//real street
function split4Fixer(doc) {
    let add = doc.title.split(' ').slice(1, 5)
    return { popjav_code: `${doc.popjav_code.trim()} ${add[0]} ${add[1]} ${add[2]}}` }
}

//fixing over adding
function splitNormalFix(doc) {
    let fix = doc.popjav_code.trim().split(' ')
    return { popjav_code: `${fix[0]} ${fix[1]}` }
}
//fix if the number is copied multiple times
// console.log(doc.popjav_code, '==>',`${doc.popjav_code.trim()} ${add[0]}`)
        // let codeArr = doc.popjav_code.split(' ')
        // let shortened = codeArr[0] + ' ' + codeArr[1]
        // collection.updateOne({ _id: doc._id }, { $set: { popjav_code: shortened } }, (err, result) => console.log(result.modifiedCount))