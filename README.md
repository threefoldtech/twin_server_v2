# twin_server

twin server used for creating deployment on grid3

Github repo: [twin_server_v2](https://github.com/threefoldtech/twin_server_v2.git)

## Prerequisites

- node
- npm

## Installation

```bash
npm install typescript -g
npm install

```

## Configuration

Add substrate url and account's mnemonics in config.json before running the server.

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
