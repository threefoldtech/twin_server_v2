import { TFClient } from "grid3_client";
declare class Twins {
    client: TFClient;
    constructor();
    create(options: any): Promise<any>;
    get(options: any): Promise<any>;
    list(options: any): Promise<any>;
    delete(options: any): Promise<any>;
}
export { Twins as twins };
