import { TFClient } from "grid3_client";
declare class Contracts {
    client: TFClient;
    constructor();
    create(options: any): Promise<any>;
    get(options: any): Promise<any>;
    update(options: any): Promise<any>;
    cancel(options: any): Promise<any>;
}
export { Contracts as contracts };
