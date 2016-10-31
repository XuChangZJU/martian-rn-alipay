/**
 * Created by Administrator on 2016/10/31.
 */
const http = require('http');
const url = require('url');
const sign = require('./sign');

http.createServer(function(req, res) {
    const urlObj =  url.parse(req.url, true);
    const query = urlObj.query;

    try {
        if(query && query.totalAmount && !isNaN(parseInt(query.totalAmount))) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            const orderInfo = JSON.stringify(sign.signOrderString(query.totalAmount));
            console.log(`orderInfo:${orderInfo}`);
            res.write(orderInfo);
            res.end();
        }
        else {
            console.log("没有传入totalAmount参数");
            res.writeHead(404);
            res.end();
        }
    }
    catch(err) {
        console.error("error");
        console.error(err);
        res.writeHead(404);
        res.write(err.message);
        res.end();
    }
}).listen(2005);

console.log("HTTP server is listening at port 2005.");
