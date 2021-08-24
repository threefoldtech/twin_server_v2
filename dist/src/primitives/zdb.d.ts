import { Workload, ZdbModes, DeviceTypes } from "grid3_client";
declare class zdb {
    create(name: string, namespace: string, size: number, mode: ZdbModes, password: string, type: DeviceTypes, pub: boolean, metadata?: string, description?: string, version?: number): Workload;
    update(name: string, namespace: string, size: number, mode: ZdbModes, password: string, type: DeviceTypes, pub: boolean, metadata?: string, description?: string, version?: number): Workload;
}
export { zdb };
