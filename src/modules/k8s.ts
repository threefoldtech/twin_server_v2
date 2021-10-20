import { AddWorkerModel, DeleteWorkerModel, K8SModel, K8SDeleteModel, K8SGetModel } from "grid3_client";
import { expose } from "../helpers/expose";
import { K8sModule } from "grid3_client";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class K8s {
    kubernetes: K8sModule;

    constructor() {
        const rmbClient = getRMBClient();
        this.kubernetes = new K8sModule(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy(options: K8SModel) {
        return await this.kubernetes.deploy(options);
    }

    @expose
    list() {
        return this.kubernetes.list();
    }

    @expose
    async get(options: K8SGetModel) {
        return await this.kubernetes.get(options);
    }

    @expose
    async delete(options: K8SDeleteModel) {
        return await this.kubernetes.delete(options);
    }

    @expose
    async update(options: K8SModel) {
        return await this.kubernetes.update(options);
    }

    @expose
    async add_worker(options: AddWorkerModel) {
        return await this.kubernetes.addWorker(options);
    }

    @expose
    async delete_worker(options: DeleteWorkerModel) {
        return await this.kubernetes.deleteWorker(options);
    }
}

export { K8s as k8s };
