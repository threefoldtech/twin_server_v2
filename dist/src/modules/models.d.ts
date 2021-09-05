declare class Disks {
    size: number;
    mountpoint: string;
}
declare class Network {
    name: string;
    ip_range: string;
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
    node_ids: number[];
    disk_size: number;
    public_ip: boolean;
    cpu: number;
    memory: number;
    name: string;
    secret: string;
    workers: number;
    metadata: string;
    description: string;
    ssh_key: string;
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
export { Machines, K8S, ContractCreate, ContractGet, ContractUpdate, ContractCancel, TwinCreate, TwinGet, TwinList, TwinDelete };
