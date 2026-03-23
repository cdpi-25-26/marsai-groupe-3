import instance from "./config.js";

async function getJuryMembers() {
  return await instance.get("jury-members");
}

async function updateJuryMembers(members) {
  return await instance.put("jury-members", { members });
}

export { getJuryMembers, updateJuryMembers };
