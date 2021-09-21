import "reflect-metadata";

const metadataKey = "exposeDecorator";

function expose(target, propertyKey) {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}

function isExposed<T>(instance: T, propertyKey: string) {
    return Reflect.hasMetadata(metadataKey, instance, propertyKey);
}
export { expose, isExposed };
