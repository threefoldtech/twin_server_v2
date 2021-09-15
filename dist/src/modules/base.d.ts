declare class BaseModule {
    fileName: string;
    save(name: string, contracts: Object, wgConfig?: string): {
        contracts: any[];
        wireguard_config: string;
    };
    _list(): string[];
    exists(name: any): boolean;
    _getDeploymentNodeIds(name: any): any[];
    _getContracts(name: any): any;
    _getContractIdFromNodeId(name: any, nodeId: any): any;
    _getNodeIdFromContractId(name: any, contractId: any): any;
    _get(name: string): Promise<any[]>;
    _delete(name: string): Promise<any[] | {
        deleted: any[];
        updated: any[];
    }>;
}
export { BaseModule };
