import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const key = '0d6a9bb5af126f73350a2afc058492765446aaad';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2NhbGFuZGFyL3YxLyIsInN1YiI6InVzcl8xMjMiLCJpYXQiOjE0NTg3ODU3OTYsImV4cCI6MTQ1ODg3MjE5Nn0.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const staticFilesPath = path.join(__dirname, '../dist');
app.use(express.static(staticFilesPath));
app.get('/api/ping', (req, res) => {
  res.send(token);
});

app.get('/api/user', (req, res) => {
  const url = `https://api.github.com/user?key=${key}`;
  const auth_url = `https://myuser:0d6a9bb5af126f73350a2afc058492765446aaad@api.github.com`
  // Get the user endpoint from the request query parameters
  const userEndpoint = req.query.endpoint;

  // Generate the file path based on the user endpoint
  const filePath = path.join(__dirname, `../dist/${userEndpoint}`);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file doesn't exist, return a 404 status code
      res.status(404).send('File not found');
    } else {
      // If the file exists, send it to the client
      res.sendFile(filePath);
    }
  });
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../dist/index.html');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});