import { expose } from "../helpers/expose";

class K8s {
    @expose
    deploy(message, payload) {
        console.log(message, payload);
        return "deployed"
    }
}
export { K8s }