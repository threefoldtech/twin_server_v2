import { BaseModule } from "./base";
import { Machines } from "./models";
declare class Machine extends BaseModule {
    fileName: string;
    deploy(options: Machines): Promise<{
        contracts: any[];
    }>;
    list(): string[];
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[] | {
        deleted: any[];
        updated: any[];
    }>;
    update(options: Machines): Promise<{
        contracts: any[];
    }>;
}
export { Machine as machine };
