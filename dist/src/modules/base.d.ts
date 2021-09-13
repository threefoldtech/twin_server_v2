declare class BaseModule {
    fileName: string;
    save(name: string, contracts: Object[], wgConfig?: string): {
        contracts: any[];
    };
    exists(name: any): any;
    _getDeploymentNodeIds(name: any): any[];
    _get(name: string): Promise<any[]>;
    _delete(name: string): Promise<any[]>;
}
export { BaseModule };
