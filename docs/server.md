# twin_server

## Prerequisites

- [RMB server](https://github.com/threefoldtech/rmb)
- node 14.4.0 or higher
- npm 6.14.5 or higher

## Installation

```bash
npm install typescript -g
npm install

```

## Configuration

Add substrate url and account's mnemonics in config.json before running the server. [see](https://github.com/threefoldtech/grid3_client_ts/blob/development/docs/test_setup.md#create-twin)

```json
{
    "url": "<substrate url>",
    "mnemonic": "<your account mnemonics>", 
    "twin_id": <your twin id created on substrate>
}
```

## Building

```bash
tsc --build tsconfig.json
```

## Running

```bash
node dist/src/server.js
```

## Usage

This is an example of getting a twin.
Put the following content in a file `test_twin.ts`

```ts
import { MessageBusClient } from "grid3_client"

async function main() {
    const myTwinId = 8    // change to your twin id
    const cmd = "twinserver.twins.get"
    const payload = JSON.stringify({ 'id': 1 })
    const rmb = new MessageBusClient();
    const msg = rmb.prepare(cmd, [config.twin_id], 0, 2);
    const message = await rmb.send(msg, payload);
    const result = await rmb.read(message)
    console.log(result)
}
main()
```

And then run this file by `tsc test_twin.ts && node test_twin.js`
