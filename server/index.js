import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const staticFilesPath = path.join(__dirname, '../dist');
app.use(express.static(staticFilesPath));
app.get('/api/ping', (req, res) => {
  res.send('Pong!');
});


app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../dist/index.html');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});