import { MessageBusServer } from "grid3_client";
import { isExposed } from "./helpers/expose"
import * as modules from "./modules"

class Server {
    server: MessageBusServer;
    constructor(port = 6379) {
        this.server = new MessageBusServer(port);
    }

    async wrapFunc(message, payload) {
        const parts = message.cmd.split(".");
        const module = parts[1]
        const method = parts[2]
        const obj = new modules[module]()
        console.log("Executing Method: " + method + " in Module:" + module + " with Payload: " + payload)
        return await obj[method](JSON.parse(payload));
    }

    register() {
        for (let module of Object.getOwnPropertyNames(modules).filter(item => typeof modules[item] === 'function')) {
            const obj = new modules[module]()
            const props = Object.getPrototypeOf(obj)
            const methods = Object.getOwnPropertyNames(props)
            for (let method of methods) {
                if (isExposed(obj, method) == true) {
                    this.server.withHandler("twinserver." + module + "." + method, this.wrapFunc)
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
