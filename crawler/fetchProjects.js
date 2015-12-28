import _ from 'lodash';
import fs from 'fs';
import request from 'superagent';
import cheerio from 'cheerio';
import sleep from 'sleep';

let i = 0;
let date = new Date();
date.setDate(date.getDate() - 1);
date = date.toISOString().slice(0, 10);
const user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36';
const base_url = 'http://www.archdaily.com/search/projects'
const detail_url = 'http://www.archdaily.com'
const lastOne = fileExists(`./crawler/byDate/${date}`) ? (fs.readFileSync(`./crawler/byDate/${date}`, { encoding: 'utf8' })).split('\n')[0] : '';
const file = `./crawler/byDate/${(new Date()).toISOString().slice(0, 10)}`;

function getAllUrl() {
    i++; // page count up
    request.get(base_url)
      .set({
          'User-Agent': user_agent
      })
      .query({page: i})
      .end(function(err, res) {
          if (!err) {
              var $ = cheerio.load( res.text );
              var results = $('.result')
              console.log(`\nPage: ${i}\n`);
              _.each(results, function(item) {
                  var link = detail_url + item.children[1].attribs.href;
                  console.log(link);
                  if (link === lastOne) {
                    console.log(`All resources extracted. done!`)
                    process.exit(0);
                  } else {
                    fs.appendFileSync(file, `${link}\n`);
                  }
              })
          } else {
            console.log(`Page: ${i}. Error: ${err}`);
          }
          sleep.sleep(5);
          getAllUrl();
      });
}

function fileExists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch(e) {
    return false;
  }
}

export default function write() {
  if (!fileExists(file)) {
    fs.writeFileSync(file, '');
  }
  getAllUrl();
}

