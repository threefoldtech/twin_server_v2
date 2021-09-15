import { K8S } from "./models";
import { BaseModule } from "./base";
declare class K8s extends BaseModule {
    fileName: string;
    deploy(options: K8S): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
        wireguard_config: string;
    }>;
    list(): string[];
    get(options: any): Promise<any[]>;
    delete(options: any): Promise<any[] | {
        deleted: any[];
        updated: any[];
    }>;
}
export { K8s as k8s };
