import MembershipType from "../models/MembershipType.js";

const seedMembershipTypes = async () => {
  const types = ["Individual Affiliate Member", "Affiliate Club", "National Federation"];
  for (const name of types) {
    await MembershipType.findOrCreate({ where: { name } });
  }
};

export default seedMembershipTypes;
