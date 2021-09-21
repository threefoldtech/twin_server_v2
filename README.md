# twin_server

twin server used for creating deployment on grid3 over [RMB server](https://github.com/threefoldtech/rmb)

Github repo: [twin_server_v2](https://github.com/threefoldtech/twin_server_v2.git)

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
