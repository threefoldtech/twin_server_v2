import { BaseModule } from "./base";
import { ZDB } from "./models";
declare class Zdb extends BaseModule {
    fileName: string;
    deploy(options: ZDB): Promise<{
        contracts: any[];
    }>;
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[]>;
}
export { Zdb as zdb };
