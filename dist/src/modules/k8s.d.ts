import { K8S } from "./models";
declare class K8s {
    deploy(options: K8S): Promise<{
        contracts: any[];
        wireguard_config: string;
    }>;
}
export { K8s as k8s };
