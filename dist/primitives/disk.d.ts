import { Workload, Mount } from "grid3_client";
declare class Disk {
    createMount(name: string, mountpoint: string): Mount;
    create(size: number, name: string, metadata?: string, description?: string, version?: number): Workload;
    update(size: number, name: string, metadata?: string, description?: string, old_version?: number): Workload;
}
export { Disk };
