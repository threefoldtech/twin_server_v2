import { BaseModule } from "./base";
import { ZDBS } from "./models";
declare class Zdbs extends BaseModule {
    fileName: string;
    deploy(options: ZDBS): Promise<{
        contracts: any[];
    }>;
    list(): string[];
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[] | {
        deleted: any[];
        updated: any[];
    }>;
}
export { Zdbs as zdbs };
