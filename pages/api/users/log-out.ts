import type { NextApiRequest, NextApiResponse } from "next";
import withMethodGuard from "../../../lib/server/withMethodGuard";
import { withApiSession } from "../../../lib/server/withSession";

export type LogoutResponse = {
  ok: boolean;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  req.session.destroy();

  return res.status(200).json({ ok: true });
}

export default withApiSession(withMethodGuard({ methods: ["GET"], handler }));
