import * as FS from "fs";
import * as PATH from "path";
import getAppDataPath from "appdata-path";

const appsPath = getAppDataPath()
const appPath = PATH.join(appsPath, "twinserver")

function loadFromFile(path: string) {
    const data = FS.readFileSync(path)
    return JSON.parse(data.toString())
}

function dumpToFile(path: string, data) {
    return FS.writeFileSync(path, JSON.stringify(data))
}

export { loadFromFile, dumpToFile, appPath }
