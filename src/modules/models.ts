import { Deployment, ZdbModes, DeviceTypes } from "grid3_client"

class Disks {
    size: number;
    mountpoint: string;
}

class Network {
    name: string;
    ip_range: string;
}

class KubernetesNode {
    node_id: number
    cpu: number;
    memory: number;
    disk_size: number;
    public_ip: boolean;

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

class K8S {
    name: string
    secret: string
    masters: KubernetesNode[]
    workers: KubernetesNode[]
    metadata: string;
    description: string
    ssh_key: string
}

class ZDB {
    node_id: number
    mode: ZdbModes
    disk_size: number
    disk_type: DeviceTypes
    public: boolean
    name: string
    namespace: string
    password: string
    metadata: string
    description: string
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
    K8S,
    ZDB,
    ContractCreate,
    ContractGet,
    ContractUpdate,
    ContractCancel,
    TwinCreate,
    TwinGet,
    TwinList,
    TwinDelete
}
