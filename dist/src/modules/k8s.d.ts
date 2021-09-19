import { Workload } from "grid3_client";
import { AddWorker, DeleteWorker, K8S } from "./models";
import { BaseModule } from "./base";
declare class K8s extends BaseModule {
    fileName: string;
    _getMastersWorkload(deployments: any): Workload[];
    _getMastersIp(deployments: any): string[];
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
    update(options: K8S): Promise<"Nothing found to update" | {
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    add_worker(options: AddWorker): Promise<{
        contracts: {
            created: any[];
            updated: any[];
            deleted: any[];
        };
    }>;
    delete_worker(options: DeleteWorker): Promise<{
        created: any[];
        updated: any[];
        deleted: any[];
    }>;
}
export { K8s as k8s };
