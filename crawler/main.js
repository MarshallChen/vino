import _ from 'lodash';
import fs from 'fs';
import util from 'util';
import stream from 'stream';
import es from 'event-stream';
import request from 'superagent';
import cheerio from 'cheerio' ;
import sleep from  'sleep' ;
import process from 'process';
import Promise from 'bluebird';
import r from 'rethinkdb';
import moment from 'moment';

const user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36';
const base_url = 'http://www.archdaily.com/search/projects'
const detail_url = 'http://www.archdaily.com'
const fetched = './crawler/fetched'
const totallyFailed = './crawler/totallyFailed'
const urls = (fs.readFileSync(`./crawler/byDate/${(new Date()).toISOString().slice(0, 10)}`, { encoding: 'utf8' })).split('\n');
let i = 0;
let connection;
r.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
  if (err) throw err;
  connection = conn;
});


function insert({ title, addedDate, summary, descriptions, images, source }) {
  return new Promise((resolve, reject) => {
    r.db('architectures').table('zeus').insert({
      addedDate,
      title,
      summary,
      descriptions,
      images,
      source
    }).run(connection, (err, res) => {
      if (err) reject(err)
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
        var title = $('.article-header').find('h1').text().replace(/\n/g, '').trim()
        var time = $('.theDate').text().replace(/\n/g, '').trim();
        var timeString = moment(time, 'hh:mm - DD MMMM, YYYY').isValid() && moment(time, 'hh:mm - DD MMMM, YYYY').toJSON();
        var specs = $('.char-list');
        var content = $('#single-content');
        var gallery = $('#gallery-thumbs');
        var specs_json = [];
        var desc = [];
        var images = [];
        specs.find('li').each((i, li) => {
          let title = $(li).find('.char-title').text().replace(/\s\s+/g, '');
          let text = $(li).find('.char-text').text().replace(/\s\s+/g, '');
          if (title && text) specs_json.push(`${title}:${text}`);
        });
        content.find('p').not('.thumbs').each((i, p) => {
          let description = $(p).text().replace(/(\r\n|\n|\r)/g, '').trim();
          if (description !== '') desc.push(description);
        })
        gallery.find('img').each((i, img) => {
          let src = $(img).attr('data-src').replace(/thumb_jpg/g, 'large_jpg');
          if (src) images.push(src);
        });
        // $('script').each((i, script) => {
        //   if ($(script).text().match('galleryContent')) {
        //     let str = $(script).text().replace(/\s\s+|\n|\r|\r\n/g, '');
        //     let extractedSrc = str.match(/(http:[^\s]+)/g);
        //     if (extractedSrc.length) {
        //       extractedSrc.forEach(src => {
        //         images.push(src.replace(/'/g, '').replace(/thumb_jpg/g, 'large_jpg'))
        //       })
        //     }
        //   }
        // })
        if (title && timeString && specs_json.length && desc.length && images.length) {
          insert({
            addedDate: timeString,
            title,
            summary: specs_json,
            descriptions: desc,
            images,
            source: url
          })
          .then(() => {
            console.log(`Insert Done ${url}`);
            fs.appendFileSync(fetched, `${url}\n`);
            resolve(true)
          })
          .catch(err => {
            console.log(`Insert Failed ${url}`);
            reject(err)
          })
        } else {
          console.log(`Extraction failed. ${url}`);
          fs.appendFileSync(totallyFailed, `${url}\n`);
          reject('Extraction failed.');
        }
      } else {
        console.log(`Parsing page failed. ${url}`);
        fs.appendFileSync(totallyFailed, `${url}\n`);
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

fetchDetail();
