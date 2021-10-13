import { TFClient } from "grid3_client";
import { default as config } from "../../config.json";

class TFGridClient extends TFClient {
    constructor() {
        super(config.url, config.mnemonic);
    }
    async execute(context, method, args) {
        let result;
        try {
            await this.connect();
            console.log(`Executing method: ${method.name} with args: ${args}`);
            result = await method.apply(context, args);
        }
        catch (e) {
            throw Error(e);
        }
        finally {
            await this.disconnect();
        }
        return result;
    }
}

export { TFGridClient };
