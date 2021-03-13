const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs');
const { assert } = require('console');
async function requestPageAndAppend(page, db) {
    let response = await fetch("http://www.javlibrary.com/en/", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "upgrade-insecure-requests": "1",
            "cookie": "timezone=-420; __qca=P0-266266616-1612993137766; __PPU_SESSION_1_1795512=1612993137808|1|1612993147976|1|1; cf_clearance=180679871a93ed518785545ba9c83e1f0b201b63-1613950371-0-150; over18=18; __cfduid=d9946c6a4453e54840c31f910a2e2a8b71615504630"
        },
        "referrer": "http://www.javlibrary.com/en/vl_maker.php?&mode=2&m=arlq",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    });
    console.log(response)
    return await response.text()
}



//test first
requestPageAndAppend().then((text)=>{
    fs.writeFile('jlibrary.html',text,(err)=>{
        assert(err,null)
        console.log('filewriting seems success')
    })
})


