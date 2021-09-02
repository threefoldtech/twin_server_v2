import { TFClient } from "grid3_client";
import { TwinCreate, TwinGet, TwinList, TwinDelete } from "./models";
declare class Twins {
    client: TFClient;
    constructor();
    create(options: TwinCreate): Promise<any>;
    get(options: TwinGet): Promise<any>;
    list(options: TwinList): Promise<any>;
    delete(options: TwinDelete): Promise<any>;
}
export { Twins as twins };
