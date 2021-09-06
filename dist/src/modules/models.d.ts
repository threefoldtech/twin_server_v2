import { ZdbModes, DeviceTypes } from "grid3_client";
declare class Disks {
    size: number;
    mountpoint: string;
}
declare class Network {
    name: string;
    ip_range: string;
}
declare class KubernetesNode {
    node_id: number;
    cpu: number;
    memory: number;
    disk_size: number;
    public_ip: boolean;
}
declare class Machines {
    name: string;
    node_id: number;
    disks: Disks[];
    network: Network;
    public_ip: boolean;
    cpu: number;
    memory: number;
    flist: string;
    entrypoint: string;
    metadata: string;
    description: string;
    env: Object;
}
declare class K8S {
    name: string;
    secret: string;
    masters: KubernetesNode[];
    workers: KubernetesNode[];
    metadata: string;
    description: string;
    ssh_key: string;
}
declare class ZDB {
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    disk_type: DeviceTypes;
    public: boolean;
    name: string;
    namespace: string;
    password: string;
    metadata: string;
    description: string;
}
declare class ContractCreate {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number;
}
declare class ContractGet {
    id: number;
}
declare class ContractUpdate {
    id: number;
    hash: string;
    data: string;
}
declare class ContractCancel {
    id: number;
}
declare class TwinCreate {
    ip: string;
}
declare class TwinGet {
    id: number;
}
declare class TwinList {
}
declare class TwinDelete {
    id: number;
}
export { Machines, K8S, ZDB, ContractCreate, ContractGet, ContractUpdate, ContractCancel, TwinCreate, TwinGet, TwinList, TwinDelete };
