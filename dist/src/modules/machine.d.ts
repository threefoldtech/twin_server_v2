import { BaseModule } from "./base";
import { Machines } from "./models";
declare class Machine extends BaseModule {
    fileName: string;
    deploy(options: Machines): Promise<{
        contracts: any[];
    }>;
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[]>;
}
export { Machine as machine };
