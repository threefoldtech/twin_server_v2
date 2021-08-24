import 'reflect-metadata';
declare function expose(target: any, propertyKey: any): void;
declare function isExposed<T>(instance: T, propertyKey: string): boolean;
export { expose, isExposed };
