declare class BaseModule {
    fileName: string;
    save(name: string, contracts: Object[], wgConfig?: string): {
        contracts: any[];
    };
    _list(): string[];
    exists(name: any): boolean;
    _getDeploymentNodeIds(name: any): any[];
    _get(name: string): Promise<any[]>;
    _delete(name: string): Promise<any[]>;
}
export { BaseModule };
