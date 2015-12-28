import r from 'rethinkdb';
import fs from 'fs';
import request from 'superagent';
import Promise from 'bluebird';
import cheerio from 'cheerio';
import process from 'process';
import sleep from 'sleep';
import moment from 'moment';

const user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36';
let urls;
let i = 0;
let connection;
r.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
  if (err) throw err;
  connection = conn;
});

function insert({ date, url }) {
  return new Promise((resolve, reject) => {
    r.db('architectures')
     .table('zeus')
     .filter({ source: url })
     .update({ addedDate: date })
     .run(connection, (err, res) => {
        if (err) reject(err);
        resolve(res)
     })
   })
}

function parseDetail( url ) {
  return new Promise((resolve, reject) => {
    let req = request.get(url);
    req.set({ 'User-Agent': user_agent });
    req.timeout(20000);
    req.end((err, res) => {
      if (!err) {
        var $ = cheerio.load( res.text );
        var time = $('.theDate').text().replace(/\n/g, '').trim();
        var timeString = moment(time, 'DDMMMYYYY').isValid() && moment(time, 'DDMMMYYYY').toJSON();
        if (time && timeString) {
          insert({
            date: timeString,
            url
          })
          .then(() => {
            console.log(`Insert Done ${url}`);
            resolve(true)
          })
          .catch(err => {
            console.log(`Insert Failed ${url}`);
            reject(err)
          })
        } else {
          console.log(`Extraction failed. ${url}`);
          // fs.appendFileSync(totallyFailed, `${url}\n`);
          reject('Extraction failed.');
        }
      } else {
        console.log(`Parsing page failed. ${url}`);
        // fs.appendFileSync(totallyFailed, `${url}\n`);
        reject(err)
      }
    })
    return req;
  })
}

function fetchDetail() {
  if (i >= urls.length - 1) {
    console.log(`Extraction Complete. All done!`);
    process.exit(0);
  }
  parseDetail(urls[i])
    .then(() => {
      console.log('Wait a second ...');
      sleep.sleep(1);
      i++;
      fetchDetail();
    }).catch(err => {
      console.log(`Error: ${err}`);
      sleep.sleep(1);
      i++;
      fetchDetail();
    })
}

export default function addDate(file) {
  urls = (fs.readFileSync(`./crawler/splited/urlsa${file}`, { encoding: 'utf8' })).split('\n');
  fetchDetail();
}
