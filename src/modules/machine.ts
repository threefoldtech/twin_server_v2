import { Machines, MachinesDelete, MachinesGet } from "grid3_client";
import { Machine } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class MachineModule {
    vm: Machine;
    constructor() {
        const rmbClient = getRMBClient();
        this.vm = new Machine(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy(options: Machines) {
        return await this.vm.deploy(options);
    }

    @expose
    list() {
        return this.vm.list();
    }

    @expose
    async get(options: MachinesGet) {
        return await this.vm.get(options);
    }

    @expose
    async delete(options: MachinesDelete) {
        return await this.vm.delete(options);
    }

    @expose
    async update(options: Machines) {
        return await this.vm.update(options);
    }
}

export { MachineModule as machine };
