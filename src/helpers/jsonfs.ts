import getAppDataPath from "appdata-path";
import * as FS from "fs";
import * as PATH from "path";

const appsPath = getAppDataPath()
const appPath = PATH.join(appsPath, "twinserver")

function loadFromFile(path) {
    const data = FS.readFileSync(path)
    return JSON.parse(data.toString())
}

function dumpToFile(path, data) {
    return FS.writeFileSync(path, JSON.stringify(data))
}
export { loadFromFile, dumpToFile, appPath }
