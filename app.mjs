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

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

// config
const port = config.get('server.port');
const proxyPort = config.get('server.proxyPort')
const host = config.get('server.host');
const protocol = (config.get("server.encrypted")) ? "https" : "http";


// WebDAV client
const webdavClient = createClient(  "https://cloud.tbwebtech.de/remote.php/dav/files/eisbaer1832/", {
  username: "eisbaer1832",
  password: "2004"
});

// File upload middleware
const upload = multer({ storage: multer.memoryStorage() });



app.use('/public',express.static('public'));
//app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.get('/', (_, res) => {res.sendFile('/public/html/Abgabe.html', {root: __dirname })});
app.listen(port, () => {logger.info(`App listening on port ${port}!`)});
logger.info("Protocol: " + protocol)
logger.info("Host: " + host)
logger.info("Proxy Port: " + proxyPort)



// Proxy route to upload files
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    await webdavClient.putFileContents(`JP Testing/${req.file.originalname}`, req.file.buffer);
  } catch (err) {
    logger.error(err);
  }
});
