const RMBServer = require('grid3_client/rmb/server')
import { isExposed } from "./helpers/expose"
import * as modules from "./modules"

class Server {
    server: any;
    constructor(port = 6379) {
        this.server = new RMBServer.MessageBusServer(port);
    }
    register() {
        for (let module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === 'function')) {
            const obj = new modules[module]()
            const props = Object.getPrototypeOf(obj)
            const names = Object.getOwnPropertyNames(props)
            for (let name of names) {
                if (isExposed(obj, name) == true) {
                    this.server.withHandler("twinserver." + module.toLocaleLowerCase() + "." + name, obj[name])
                }
            }

        }
    }
    run() {
        this.server.run()
    }
}
const server = new Server();
server.register()
server.run()
