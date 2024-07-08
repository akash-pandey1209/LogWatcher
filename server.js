const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const logFilePath = path.join(__dirname, 'logfile.log');
const clients = new Set();
const CHUNK_SIZE = 1024 * 1024 ; 

app.use(express.static(__dirname));


const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    clients.add(ws);

    
    sendLast10Lines(ws);

    ws.on('close', () => {
        clients.delete(ws);
    });
});


function sendLast10Lines(ws) {
    fs.stat(logFilePath, (err, stats) => {
        if (err) throw err;

        let fileSize = stats.size;
        let readSize = Math.min(CHUNK_SIZE, fileSize);
        let buffer = Buffer.alloc(readSize);
        let position = fileSize - readSize;

        fs.open(logFilePath, 'r', (err, fd) => {
            if (err) throw err;

            fs.read(fd, buffer, 0, readSize, position, (err, bytesRead, buffer) => {
                if (err) throw err;

                let data = buffer.toString('utf-8');
                let lines = data.trim().split('\n');
                let last10Lines = lines.slice(-10).join('\n');
                ws.send(last10Lines);
                fs.close(fd, () => {});
            });
        });
    });
}


fs.watchFile(logFilePath, (curr, prev) => {
    if (curr.size > prev.size) {
        fs.open(logFilePath, 'r', (err, fd) => {
            if (err) throw err;
            const bufferSize = curr.size - prev.size;
            const buffer = Buffer.alloc(bufferSize);
            fs.read(fd, buffer, 0, bufferSize, prev.size, (err, bytesRead, buffer) => {
                if (err) throw err;
                const newLog = buffer.toString('utf-8');
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(newLog);
                    }
                });
                fs.close(fd, () => {});
            });
        });
    }
});

server.listen(8080, () => {
    console.log('this is the server on which it is running http://localhost:8080');
});
