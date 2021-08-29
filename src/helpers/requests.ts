import * as request from "request-promise-native";

async function send(method, url, body, headers) {
    let options = {
        uri: url,
        body: body,
        headers: headers
    }
    return await request[method](options);
}
export { send }