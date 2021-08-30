import { send } from "../helpers/requests"


async function getNodeTwinId(node_id) {
    const headers = { 'Content-Type': 'application/json' }
    const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`
    const response = await send("post", "https://explorer.devnet.grid.tf/graphql/", JSON.stringify({ "query": body }), headers)
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
    const nodeResponse = await send("post", "https://explorer.devnet.grid.tf/graphql/", JSON.stringify({ "query": body }), headers)
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
    const pubConfigResponse = await send("post", "https://explorer.devnet.grid.tf/graphql/", JSON.stringify({ "query": body }), headers)
    const pubConfigRes = JSON.parse(pubConfigResponse)
    const configs = pubConfigRes["data"]["publicConfigs"]

    let accessNodes = {}
    for (let nodeId of Object.keys(nodeConfigs)) {
        const config = nodeConfigs[nodeId]
        for (let conf of configs) {
            if (config === conf["id"]) {
                accessNodes[nodeId] = [conf["ipv4"], conf["ipv6"]]
            }
        }
    }
    console.log(accessNodes)
    return accessNodes
}

export { getNodeTwinId, getAccessNodes }
