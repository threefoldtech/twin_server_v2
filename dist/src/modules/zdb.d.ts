import { ZDB } from "./models";
declare class Zdb {
    deploy(options: ZDB): Promise<{
        contracts: any[];
    }>;
}
export { Zdb as zdb };
