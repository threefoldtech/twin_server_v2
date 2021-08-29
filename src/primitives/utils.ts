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
export { getNodeTwinId }
