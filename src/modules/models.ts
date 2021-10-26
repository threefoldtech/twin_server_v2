import { Deployment } from "grid3_client";

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

class ZOS extends Deployment {
    node_id: number;
}

export {
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
    ZOS,
};
