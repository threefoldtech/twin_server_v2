import {
    MachinesModel,
    MachinesDeleteModel,
    MachinesGetModel,
    AddMachineModel,
    DeleteMachineModel,
} from "grid3_client";
import { MachineModule } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class Machines {
    vm: MachineModule;
    constructor() {
        const rmbClient = getRMBClient();
        this.vm = new MachineModule(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy(options: MachinesModel) {
        return await this.vm.deploy(options);
    }

    @expose
    list() {
        return this.vm.list();
    }

    @expose
    async get(options: MachinesGetModel) {
        return await this.vm.get(options);
    }

    @expose
    async delete(options: MachinesDeleteModel) {
        return await this.vm.delete(options);
    }

    @expose
    async update(options: MachinesModel) {
        return await this.vm.update(options);
    }

    @expose
    async add_machine(options: AddMachineModel) {
        return await this.vm.addMachine(options);
    }

    @expose
    async delete_machine(options: DeleteMachineModel) {
        return await this.vm.deleteMachine(options);
    }
}

export { Machines as machines };
