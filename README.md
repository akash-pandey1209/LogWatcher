# LogWatcher
Purpose:

I developed a log watching solution similar to the "tail -f" UNIX command. Nonetheless, the file is here on a remote machine. The project is thus designed like the following:

A server side program which monitors the given file and streams its updates. It runs on the same machine as the log file and it uses WebSockets to be able to push the file updates to the client(s).

A web-based client that prints the updates of the file as they happen. Only the last 10 lines in the file are displayed when the page is loaded.

Usage:

This project is very simple to use, you only have to clone this repository:

install the dependencies (websocket & mock-fs):
npm init -y

npm install ws

After that, run the server:

npm server.js

Finally, open your browser and go to the following url:

http://localhost:8080

Now, you're able to watch your logfile in your browser.

Caveats
This project has been tested with Node.js version 8.12.0 with the following browsers/OS:

Firefox Quantum v63 on Windows 10
Google Chrome v70 on Windows 10
Firefox Quantum v62 on Fedora 28
Google Chrome v69 on MacOS X
