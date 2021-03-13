const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const splitTitleRegex1 = [/carib$/i, /1pon$/i, /heyzo$/i, /paco$/i, /s-cute$/i, /heydouga$/i,
    /sdelta$/i, /本生素人TV$/i, /金8天国$/i, /人妻斬り$/i, /エッチな4610$/i, /女体のしんぴ$/i,
    /Legs-Japan$/i, /エッチな0930$/i, /Nyoshin$/i, /Fellatio-Japan$/i, /XXX-AV$/i, /Uralesbian$/i, /熟女倶楽部$/i]

//second iterations modfied_at should be greater than 1615574402204

// Connection URL
const url = 'mongodb://192.168.43.16:27017';

// Database Name
const dbName = 'info';

let CLIENT = null
let MAXPAGE = 100
let CURRENT = 14
let LOOPER = null

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    // try {
    //     const db = client.db(dbName);
    //     //run it
    //     LOOPER = setInterval(() => eachLoop(db, client), 1000)
    // } catch (error) {
    //     console.log('error at main loop', error)
    // } finally {
    //     client.close()
    // }


    //run it
    setTimeout(() => requestPageAndAppend(client), 1000 + Math.floor(Math.random() * 10000))
    // LOOPER = setInterval(() => {
    //     if (CURRENT > MAXPAGE) {
    //         clearInterval(LOOPER)
    //         setTimeout(()=>client.close(),10000)
    //     } else {
    //         setTimeout(() => {
    //             requestPageAndAppend(db)
    //         }, 2000 + Math.random() * 5000);
    //     }

    // }, 1000)
})




// function parsePage(){
//     return new Promise((resolve,reject)=>{

//     })
// }





async function requestPageAndAppend(client) {
    let nextR = 1000 + Math.floor(Math.random() * 5000);


    let response = await fetch(`https://popjav.tv/page/${CURRENT}`, {
        "headers": {
            "upgrade-insecure-requests": "1"
        },
        "referrer": `https://popjav.tv/page/${CURRENT - 1}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    })
    if (CURRENT < MAXPAGE) {
        console.log('page:', CURRENT, 'status:', response.status, 'next page after', nextR/1000, 'sec')
        setTimeout(() => requestPageAndAppend(client), nextR)
    } else {
        console.log('closing the connection..aproximately after 10 secs, last page:',CURRENT, 'status', response.status)
        setTimeout(() => client.close(), 10000)
    }
    CURRENT++    
    let selector = cheerio.load(await response.text())
    selector('li.video a').each((i, vid) => {
        let title = selector(vid).attr('title')
        let popjav_code = title.slice(0, title.indexOf(' '))
        title = title.slice(title.indexOf(' '), title.length)

        let popjav_link = selector(vid).attr('href')
        popjav_link = popjav_link.slice(popjav_link.indexOf('.') + 4)

        let now = Date.now()
        let spanDate = selector('span.time', vid).text()

        let uploadDate = new Date(spanDate)

        let popjav_img_link = selector('img', vid).attr('data-src')
        popjav_img_link = popjav_img_link.slice(popjav_img_link.indexOf('/') + 2)

        let doc = {
            popjav_code, title, popjav_link, uploadDate, popjav_img_link, modified_at: now
        }
        // console.log(popjav_link, '-->begin checking in db for duplicate link')
        //if the link is not existent
        const db = client.db(dbName);
        db.collection('vid').find({ popjav_link: popjav_link }).count().then(sameLink => {
            if (sameLink < 1) {
                //fixing code
                if (splitTitleRegex1.some(rx => rx.test(doc.popjav_code))) {
                    doc.popjav_code = split1Fixer(doc)
                    console.log(`code is now ${doc.popjav_code}`)
                } else if (/10mu/i.test(doc.popjav_code)) {
                    doc.popjav_code = split2Fixer(doc)
                    console.log(`code is now ${doc.popjav_code}`)
                } else console.log('no change in pop code')

                let dateStamp = new Date().toLocaleString()
                db.collection('vid').insertOne(doc,
                    (err, result) => console.log(`adding ${doc.popjav_code} link: ${doc.popjav_link} `, 'at', dateStamp)
                )
            }
            // else console.log(`NOT WRITING ${doc.popjav_code} with ${doc.popjav_link} already in db`)
        })
    })
}

function split1Fixer(doc) {
    let add = doc.title.split(' ').slice(1, 3)
    return { popjav_code: `${doc.popjav_code.trim()} ${add[0]}` }
}

//for 10 mu
function split2Fixer(doc) {
    let add = doc.title.split(' ').slice(1, 3)
    return { popjav_code: `${doc.popjav_code.trim()} ${add[0]} ${add[1]}` }
}




//test selector

function testCheerio() {
    require('fs').readFile('tempest.html', 'utf8', (err, data) => {
        assert.equal(null, err)
        let selector = cheerio.load(data)
        selector('li.video a').each((i, vid) => {
            let title = selector(vid).attr('title')
            let popjav_code = title.slice(0, title.indexOf(' '))
            title = title.slice(title.indexOf(' '), title.length)

            let dateStamp = new Date().toLocaleString()
            let popjav_link = selector(vid).attr('href')
            popjav_link = popjav_link.slice(popjav_link.indexOf('.') + 4)

            let now = Date.now()
            let spanDate = selector('span.time', vid).text()

            let uploadDate = new Date(spanDate)

            let popjav_img_link = selector('img', vid).attr('data-src')
            popjav_img_link = popjav_img_link.slice(popjav_img_link.indexOf('/') + 2)

            let doc = {
                popjav_code, title, popjav_link, uploadDate, popjav_img_link, modified_at: now
            }
            console.log(doc, 'at', dateStamp)

            // console.log(i, vid)
        })
    })
}
