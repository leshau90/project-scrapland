

const adds = async (a, b, l) => {
    console.log('adding: ', a, b)

    return a + b
}
let promises = []
// for (i in [...Array(30).keys()]) {
//     // promises.push(adds.apply(null,[i,1+Math.floor(Math.random()*i+10)]))
//     console.log(i)
// }
let counter = 0
let LOOPER = setInterval(() => {
    if (counter > 10) clearInterval(LOOPER)
    adds(counter, counter++)
}, 500)


Promise.all(promises).then(console.log)