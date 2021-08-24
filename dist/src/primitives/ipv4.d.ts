import { Workload } from "grid3_client";
declare class IPv4 {
    create(name: string, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, metadata?: string, description?: string, old_version?: number): Workload;
}
export { IPv4 };
