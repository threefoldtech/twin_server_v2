declare class Machine {
    deploy(options: any): Promise<{
        contracts: any[];
        wireguard_config: string;
    }>;
}
export { Machine as machine };
