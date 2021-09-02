import { TFClient } from "grid3_client";
import { ContractCreate, ContractGet, ContractUpdate, ContractCancel } from "./models";
declare class Contracts {
    client: TFClient;
    constructor();
    create(options: ContractCreate): Promise<any>;
    get(options: ContractGet): Promise<any>;
    update(options: ContractUpdate): Promise<any>;
    cancel(options: ContractCancel): Promise<any>;
}
export { Contracts as contracts };
