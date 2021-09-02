import { Machines } from "./models";
declare class Machine {
    deploy(options: Machines): Promise<{
        contracts: any[];
        wireguard_config: string;
    }>;
}
export { Machine as machine };
