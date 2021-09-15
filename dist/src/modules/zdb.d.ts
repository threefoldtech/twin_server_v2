import { BaseModule } from "./base";
import { ZDBS, DeleteZDB, AddZDB } from "./models";
declare class Zdbs extends BaseModule {
    fileName: string;
    deploy(options: ZDBS): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    list(): string[];
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[] | {
        deleted: any[];
        updated: any[];
    }>;
    update(options: ZDBS): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_zdb(options: AddZDB): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_zdb(options: DeleteZDB): Promise<Object>;
}
export { Zdbs as zdbs };
