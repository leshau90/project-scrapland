const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://192.168.43.16:27017';

// Database Name
const dbName = 'info';

let CLIENT = null
let MAXPAGE = 50
let CURRENT = 2
let LOOPER = null

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  let db;
  try {
    db = client.db(dbName);
    LOOPER = setInterval(() => eachLoop(db, client), 1000)
  } catch (e) {

  } finally {
    client.close()
  }

})





function testInsert(db) {
  db.collection('test').insertMany([{ test: 1 }, { test: 3 }, { test: 2 }], console.log)
}

// import fetch from 'node-fetch'
// import html2json from 'html2json'
// import cheerio from 'cheerio'
// import fs from 'fs'
// import os from 'os'
const fetch = require('node-fetch')
const cheerio = require('cheerio')
// const fs = require('fs')
// const os = require('os')

async function requestPageAndAppend(page, db) {
  let response = await fetch(`https://popjav.tv/page/${page}`, {
    "headers": {
      "upgrade-insecure-requests": "1"
    },
    "referrer": `https://popjav.tv/page/${page - 1}`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  })
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


    let dateStamp = new Date().toLocaleString()
    db.collection('vid').insertOne(doc, (err, result) => console.log(result.ops, 'at', dateStamp))


    // console.log(i, vid)
  })
}



function eachLoop(db, CLIENT) {
  setTimeout(() => {
    requestPageAndAppend(CURRENT, db).catch(console.log)
  }, 2000 + Math.random() * 20000);
  console.log('currently looping at page', CURRENT)
  CURRENT++
  if (CURRENT > MAXPAGE) {
    clearInterval(LOOPER)
    CLIENT.close()
  }
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
// testCheerio()


// process.on('exit',()=> CLIENT?.close());

// //catches ctrl+c event
// process.on('SIGINT',()=> CLIENT?.close());

// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1',()=> CLIENT?.close());
// process.on('SIGUSR2',()=> CLIENT?.close());

// //catches uncaught exceptions
// process.on('uncaughtException',()=> CLIENT?.close());
