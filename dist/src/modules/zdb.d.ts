import { BaseModule } from "./base";
import { ZDBS } from "./models";
declare class Zdbs extends BaseModule {
    fileName: string;
    deploy(options: ZDBS): Promise<{
        contracts: any[];
    }>;
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[]>;
}
export { Zdbs as zdbs };
