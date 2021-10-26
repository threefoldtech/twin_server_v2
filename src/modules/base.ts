import { GridClient } from "grid3_client";

import { getRMBClient } from "../clients/rmb";
import { default as config } from "../../config.json";

class Base {
    client;

    constructor() {
        const rmbClient = getRMBClient();
        this.client = new GridClient(config.twin_id, config.url, config.mnemonic, rmbClient);
    }
}

export { Base };
