import { Deployment, ZdbModes, DeviceTypes } from "grid3_client";

class Disks {
    name: string;
    size: number;
    mountpoint: string;
}

class Network {
    name: string;
    ip_range: string;
}

class BaseGetDelete {
    name: string;
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
    env: Record<string, unknown>;
}

class MachinesGet extends BaseGetDelete {}

class MachinesDelete extends BaseGetDelete {}

class KubernetesNode {
    name: string;
    node_id: number;
    cpu: number;
    memory: number;
    disk_size: number;
    public_ip: boolean;
}

class K8S {
    name: string;
    secret: string;
    network: Network;
    masters: KubernetesNode[];
    workers: KubernetesNode[];
    metadata: string;
    description: string;
    ssh_key: string;
}

class K8SGet extends BaseGetDelete {}

class K8SDelete extends BaseGetDelete {}

class AddWorker extends KubernetesNode {
    deployment_name: string;
}

class DeleteWorker {
    deployment_name: string;
    name: string;
}

class ZDB {
    name: string;
    node_id: number;
    mode: ZdbModes;
    disk_size: number;
    disk_type: DeviceTypes;
    public: boolean;
    namespace: string;
    password: string;
}

class ZDBS {
    name: string;
    zdbs: ZDB[];
    metadata: string;
    description: string;
}

class ZDBGet extends BaseGetDelete {}

class ZDBDelete extends BaseGetDelete {}

class AddZDB extends ZDB {
    deployment_name: string;
}

class DeleteZDB extends DeleteWorker {}

class NodeContractCreate {
    node_id: number;
    hash: string;
    data: string;
    public_ip: number;
}

class NameContractCreate {
    name: string;
}
class ContractGet {
    id: number;
}

class NodeContractUpdate {
    id: number;
    hash: string;
    data: string;
}

class ContractCancel {
    id: number;
}

class TwinCreate {
    ip: string;
}

class TwinGet {
    id: number;
}

class TwinDelete {
    id: number;
}

class WalletImport {
    name: string;
    secret: string;
}

class WalletBalanceByName {
    name: string;
}

class WalletBalanceByAddress {
    address: string;
}

class WalletTransfer {
    name: string;
    target_address: string;
    amount: number;
    asset: string;
    memo: string;
}

class WalletDelete {
    name: string;
}

class WalletGet extends WalletDelete {}

class DeployGatewayFQDN {
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}

class DeployGatewayName {
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}

class ZOS extends Deployment {
    node_id: number;
}

export {
    Disks,
    Machines,
    MachinesGet,
    MachinesDelete,
    K8S,
    K8SGet,
    K8SDelete,
    AddWorker,
    DeleteWorker,
    ZDBS,
    ZDBGet,
    ZDBDelete,
    AddZDB,
    DeleteZDB,
    NodeContractCreate,
    NameContractCreate,
    ContractGet,
    NodeContractUpdate,
    ContractCancel,
    TwinCreate,
    TwinGet,
    TwinDelete,
    WalletImport,
    WalletBalanceByName,
    WalletBalanceByAddress,
    WalletTransfer,
    WalletDelete,
    WalletGet,
    DeployGatewayFQDN,
    DeployGatewayName,
    ZOS,
};
