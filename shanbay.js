const https = require('https');
const querystring = require('querystring');
const decode = require('./decode');

// 填入cookie
const cookie = 'auth_token=xxxx'

const host = 'apiv3.shanbay.com'

const request = function (url, params) {
    console.log(url)
    const options = {
        host: host,
        path: `/wordscollection/learning/words/${url}?` + querystring.stringify(params),
        method: 'GET',
        headers: {
            'Cookie': cookie
        }
    };
    console.log(options.path)
    return new Promise((resolve, reject) => {
        const callback = (response) => {
            let str = '';

            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                //console.log(str);
                const responseData = JSON.parse(str);
                const decodedData = decode.d(responseData.data);
                resolve(decodedData);
            });

            response.on('error', (error) => {
                reject(error);
            });
        };
        https.request(options, callback).end();
    });
};

function learning_items(page = 1, ipp = 15) {
    const params = {
        page: page,
        order_by: 'CREATED_AT', //FAMILIARITY
        order: 'DESC',          //ASC
        ipp: ipp
    };
    return request("learning_items", params);
}

function unlearned_items(page = 1, ipp = 15) {
    const params = {
        page: page,
        order: 'DESC',          //ASC
        ipp: ipp
    };

    return request("unlearned_items", params);
}

module.exports = {
    learning_items,
    unlearned_items
};