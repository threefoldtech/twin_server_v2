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

class TwinList {}

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


class DeployGatewayFQDN{
    name: string;
    node_id: number;
    fqdn: string;
    tls_passthrough: boolean;
    backends: string[];
}

class DeployGatewayName{
    name: string;
    node_id: number;
    tls_passthrough: boolean;
    backends: string[];
}
// class ZosDeployment extends Deployment {
//     node_id: number;
//     hash: string;
// }

export {
    Disks,
    Machines,
    K8S,
    AddWorker,
    DeleteWorker,
    ZDBS,
    AddZDB,
    DeleteZDB,
    NodeContractCreate,
    NameContractCreate,
    ContractGet,
    NodeContractUpdate,
    ContractCancel,
    TwinCreate,
    TwinGet,
    TwinList,
    TwinDelete,
    WalletImport,
    WalletBalanceByName,
    WalletBalanceByAddress,
    WalletTransfer,
    WalletDelete,
    WalletGet,
    DeployGatewayFQDN,
    DeployGatewayName
};
