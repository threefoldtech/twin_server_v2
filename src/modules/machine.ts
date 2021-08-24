import { Disk } from "../primitives/disk"
import { VM } from "../primitives/vm"
import { expose } from "../helpers/expose"

class Machine {
    @expose
    deploy(options) {
        // disks
        let disks;
        for (let i = 0; i < options.disks.length; i++) {
            const disk = new Disk()
            // disk.create(options.disks[i].name, )

        }

    }
}

export { Machine as machine }