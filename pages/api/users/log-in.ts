import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../lib/server/client";
import withMethodGuard from "../../../lib/server/withMethodGuard";
import bcrypt from "bcrypt";
import { withApiSession } from "../../../lib/server/withSession";

export type LoginResponse = {
  ok: boolean;
  message?: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  const {
    body: { email, password },
  } = req;

  const user = await client.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    const authenticated = bcrypt.compareSync(password, user.password);
    if (authenticated) {
      // session (in cookie) save
      req.session.user = {
        id: user.id.toString(),
      }
      await req.session.save();

      return res.status(200).json({ ok: true });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "Email or Password is not correct." });
    }
  } else {
    return res
      .status(400)
      .json({ ok: false, message: "Email or Password is not correct." });
  }
}

export default withApiSession(withMethodGuard({ methods: ["POST"], handler }));
