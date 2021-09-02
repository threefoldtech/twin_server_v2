import { Deployment } from "grid3_client"

class Disks {
    size: number;
    mountpoint: string;
}

class Network {
    name: string;
    ip_range: string;
}

class Machines {
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
    env: Object
}

class ContractCreate {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number
}

class ContractGet {
    id: number;
}

class ContractUpdate {
    id: number;
    hash: string;
    data: string;
}

class ContractCancel {
    id: number
}

class TwinCreate {
    ip: string;
}

class TwinGet {
    id: number;
}

class TwinList {

}

class TwinDelete {
    id: number
}

// class ZosDeployment extends Deployment {
//     node_id: number;
//     hash: string;
// }

export {
    Machines,
    ContractCreate,
    ContractGet,
    ContractUpdate,
    ContractCancel,
    TwinCreate,
    TwinGet,
    TwinList,
    TwinDelete
}
