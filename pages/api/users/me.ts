import client from "../../../lib/server/client"
import type { NextApiRequest, NextApiResponse } from "next";
import withMethodGuard from "../../../lib/server/withMethodGuard";
import { withApiSession } from "../../../lib/server/withSession";

export type VerifiedUserResponse = {
  ok: boolean;
  user?: {
    email: string;
  };
  message?: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifiedUserResponse>
) {
  const id = req.session.user?.id;

  if (!id) {
    return res.status(403).json({ ok: false, message: "Please Log in." });
  }

  // authenticate user
  const registeredUser = await client.user.findFirst({
    where: {
      id: +id,
    },
    select: {
      email: true,
    }
  })
  
  if (registeredUser) {
    return res.status(200).json({
      ok: true,
      user: registeredUser,
    });
  } else {
    return res.status(403).json({ ok: false, message: "Please Log in." });
  }
}

export default withApiSession(withMethodGuard({ methods: ["GET"], handler }));
