declare class BaseModule {
    fileName: string;
    save(name: string, contracts: Object[], wgConfig?: string): {
        contracts: any[];
    };
    _get(name: any): Promise<any[]>;
    _delete(name: any): Promise<any[]>;
}
export { BaseModule };
