import express from 'express';
import { getDirectoryListing } from '../utils/getDirectoryListing.js';
import fs from 'fs';

const app = express();

app.use(express.json());
app.get('/api/file/list', (req, res) => {
    const directoryListing = getDirectoryListing(process.cwd());
    res.json(directoryListing);
});

app.get('/api/file', (req, res) => {
    const path = req.query.path;
    if (!path) {
        res.status(400).send('Missing path query parameter');
        return;
    }

    console.log(`Reading file: ${path}`);
    const fileContent = fs.readFileSync(path, 'utf-8');
    res.send(fileContent);
})

app.put('/api/file', (req, res) => {
    const path = req.query.path;
    const content = req.body.content;
    console.log(`Saving file: ${path}, content: ${content}`);

    fs.writeFileSync(path, content);
    res.send('File saved');
})

app.use(express.static('./public'));

let port = 3000;
const startListen = () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying next port`);
            port++;
            startListen();
            return;
        } 

        throw err;
    });
}

startListen();

export default app;
