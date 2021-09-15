import { ZdbModes, DeviceTypes } from "grid3_client";
declare class Disks {
    name: string;
    size: number;
    mountpoint: string;
}
declare class Network {
    name: string;
    ip_range: string;
}
declare class KubernetesNode {
    name: string;
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
    name: string;
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    disk_type: DeviceTypes;
    public: boolean;
    namespace: string;
    password: string;
}
declare class ZDBS {
    name: string;
    zdbs: ZDB[];
    metadata: string;
    description: string;
}
declare class AddZDB extends ZDB {
    deployment_name: string;
}
declare class DeleteZDB {
    deployment_name: string;
    name: string;
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
export { Machines, K8S, ZDBS, AddZDB, DeleteZDB, ContractCreate, ContractGet, ContractUpdate, ContractCancel, TwinCreate, TwinGet, TwinList, TwinDelete };
