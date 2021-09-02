declare const appPath: string;
declare function loadFromFile(path: string): any;
declare function dumpToFile(path: string, data: any): void;
export { loadFromFile, dumpToFile, appPath };
