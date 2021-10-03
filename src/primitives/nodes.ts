const isPrivateIP = require("private-ip")
const IP = require("ip")

import { send } from "../helpers/requests"

const graphqlURL = "https://tfchain.dev.threefold.io/graphql/graphql"


async function getNodeTwinId(node_id: number) {
    const headers = { 'Content-Type': 'application/json' }
    const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`
    const response = await send("post", graphqlURL, JSON.stringify({ "query": body }), headers)
    const res = JSON.parse(response)
    return res["data"]["nodes"][0]["twinId"]
}

async function getAccessNodes() {
    const headers = { 'Content-Type': 'application/json' }
    let body = `{
        nodes {
          nodeId
          publicConfigId 
        }
      }`
    const nodeResponse = await send("post", graphqlURL, JSON.stringify({ "query": body }), headers)
    const nodeRes = JSON.parse(nodeResponse)
    const nodes = nodeRes["data"]["nodes"]
    let nodeConfigs = {}
    let configsIds = ""
    for (let node of nodes) {
        if (!node.publicConfigId) {
            continue
        }
        nodeConfigs[node.nodeId] = node.publicConfigId
        configsIds += `"${node.publicConfigId}", `
    }
    body = `{
        publicConfigs (where: {id_in: [${configsIds}]}) {
          id
          ipv4
          ipv6    
        }
      }`
    const pubConfigResponse = await send("post", graphqlURL, JSON.stringify({ "query": body }), headers)
    const pubConfigRes = JSON.parse(pubConfigResponse)
    const configs = pubConfigRes["data"]["publicConfigs"]

    let accessNodes = {}
    for (let nodeId of Object.keys(nodeConfigs)) {
        const config = nodeConfigs[nodeId]
        for (let conf of configs) {
            if (config === conf["id"]) {
                const ipv4 = conf["ipv4"]
                const ipv6 = conf["ipv6"]
                if ((IP.isV4Format(ipv4.split("/")[0]) && !isPrivateIP(ipv4)) || (IP.isV6Format(ipv6.split("/")[0]) && !isPrivateIP(ipv6))) {
                    accessNodes[nodeId] = { "ipv4": ipv4, "ipv6": ipv6 }
                }
            }
        }
    }
    console.log(accessNodes)
    return accessNodes
}

export { getNodeTwinId, getAccessNodes }
