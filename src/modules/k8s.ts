import { expose } from "../helpers/expose";

class K8s {
    @expose
    deploy(options) {
        return "deployed"
    }
}
export { K8s as k8s }