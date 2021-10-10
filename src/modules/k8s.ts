import { AddWorker, DeleteWorker, K8S, K8SDelete, K8SGet } from "grid3_client";
import { expose } from "../helpers/expose";
import { K8s } from "grid3_client";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";


class K8sModule {
    kubernetes: K8s;

    constructor() {
        const rmbClient = getRMBClient();
        this.kubernetes = new K8s(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy(options: K8S) {
        return await this.kubernetes.deploy(options);
    }

    @expose
    list() {
        return this.kubernetes.list();
    }

    @expose
    async get(options: K8SGet) {
        return await this.kubernetes.get(options);
    }

    @expose
    async delete(options: K8SDelete) {
        return await this.kubernetes.delete(options);
    }

    @expose
    async update(options: K8S) {
        return await this.kubernetes.update(options);
    }

    @expose
    async add_worker(options: AddWorker) {
        return await this.kubernetes.add_worker(options);
    }

    @expose
    async delete_worker(options: DeleteWorker) {
        return await this.kubernetes.delete_worker(options);
    }
}

export { K8sModule as k8s };
