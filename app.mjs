import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import config from 'config';
import pino from 'pino';
import fs from 'fs';
import multer from 'multer';
import { createClient } from 'webdav';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
let UUIDs = []

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

UUIDs = JSON.parse(fs.readFileSync('UUIDs.json', 'utf8')).videos;
logger.info(UUIDs)


// config
const port = config.get('server.port');
const proxyPort = config.get('server.proxyPort')
const host = config.get('server.host');
const protocol = (config.get("server.encrypted")) ? "https" : "http";
const url = config.get('storage.url');
const username = config.get('storage.username');
const password = config.get('storage.password');

// WebDAV client
const webdavClient = createClient( url, {
  username: username,
  password: password
});

// File upload middleware
const upload = multer({ storage: multer.memoryStorage() });



app.use('/public',express.static('public'));
//app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.get('/', (_, res) => {res.sendFile('/public/html/Abgabe.html', {root: __dirname })});
app.get('/bewertung', (_, res) => {res.sendFile('/public/html/Bewertung.html', {root: __dirname })});

app.listen(port, () => {logger.info(`App listening on port ${port}!`)});
logger.info("Protocol: " + protocol)
logger.info("Host: " + host)
logger.info("Proxy Port: " + proxyPort)

function rand(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


const uploadMultiple = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'data', maxCount: 1 }
]);



app.post('/getReviewItems', express.text(), async (req, res) => {
  try {
    console.log(req.body.trim())
    let show = []

    for (let i = 0; i < UUIDs.length; i++) {
        if (UUIDs[i].reviewer1 == req.body|| UUIDs[i].reviewer2 == req.body|| UUIDs[i].reviewer3 == req.body) {
            console.log("can see" + UUIDs[i].uuid)
            show.push(UUIDs[i].uuid)
        }
    }

    res.status(200).json({ videos: show});
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Fehler beim Upload' });
  }
});



app.post('/upload', uploadMultiple, async (req, res) => {
  try {
    let dir = rand(100000, 999999);
    while (UUIDs.some(v => v.uuid === dir)) {
      dir = rand(100000, 999999);
    }

    // Beispiel: Reviewer zufällig aus einer Liste auswählen
    const possibleReviewers = ["anna", "ben", "carla", "david", "eva", "felix", "greta"];

    function pickReviewer(exclude = []) {
      let r;
      do {
        r = possibleReviewers[rand(0, possibleReviewers.length - 1)];
      } while (exclude.includes(r));
      return r;
    }

    const reviewer1 = { name: pickReviewer(), done: false };
    const reviewer2 = { name: pickReviewer([reviewer1.name]), done: false };
    const reviewer3 = { name: pickReviewer([reviewer1.name, reviewer2.name]), done: false };
    const newVideo = { uuid: dir, reviewer1, reviewer2, reviewer3 };

    UUIDs.push(newVideo);
    const jsonData = JSON.stringify({ videos: UUIDs }, null, 2);
    fs.writeFileSync('UUIDs.json', jsonData, 'utf8');

    await webdavClient.createDirectory(`JP Testing/${dir}`, { recursive: true });

    if (req.files.file) {
      await webdavClient.putFileContents(
        `JP Testing/${dir}/${req.body.filename}`,
        req.files.file[0].buffer
      );
    }
    if (req.files.data) {
      await webdavClient.putFileContents(
        `JP Testing/${dir}/${req.body.dataname}`,
        req.files.data[0].buffer
      );
    }

    res.status(200).json({ message: 'Upload erfolgreich', uuid: dir, reviewer1, reviewer2, reviewer3 });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Fehler beim Upload' });
  }
});
