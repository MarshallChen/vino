import lwip from 'lwip';
import request from 'superagent';

export default function blur() {
  return (req, res, next) => {
    let {
      hostname,
      protocol,
      query: { src, sigma }
    } = req;

    if (!isAbsUri(src)) {
      src = `${protocol}://${hostname}${src}`
    }

    request.get(src).end((err, response) => {
      if (err) {
        res.status(500).send(err);
      }
      console.log(new Buffer(response.text));
      console.log(`\n\n\n\n`);
      lwip.open(response.body, 'jpeg', (err, image) => {
        if (err) {
          res.status(500).send(err);
        } else {
          image.blur(parseInt(sigma), (err, image) => {
            if (err) {
              res.status(500).send(err);
            }
            image.toBuffer('jpeg', (err, buffer) => {
              if (err) {
                res.status(500).send(err);
              }
              res.set('Content-Type', 'image/jpeg').status(200).send(new Buffer(buffer));
            })
          })
        }
      })
    })
  }
}

function isAbsUri(uri) {
  return uri && (uri.indexOf('http') === 0 || uri.indexOf('https') === 0)
}