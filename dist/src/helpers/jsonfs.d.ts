declare const appPath: string;
declare function loadFromFile(path: string): any;
declare function dumpToFile(path: string, data: any): void;
declare function updatejson(path: string, name: string, data?: Object, action?: string): void;
export { loadFromFile, dumpToFile, updatejson, appPath };
