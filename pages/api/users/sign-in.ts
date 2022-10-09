import client from "../../../lib/server/client"
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withMethodGuard from "../../../lib/server/withMethodGuard";

export type SigninResponse = {
  ok: boolean;
  message?: string;
  user?: {
    email: string;
  };
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SigninResponse>
) {
  const {
    body: { email, password },
  } = req;

  if (!email) {
    return res.status(400).json({ ok: false, message: "Email and password are required." });
  }
  if (!password) {
    return res.status(400).json({ ok: false, message: "Email and password are required." });
  }

  const alreadyRegistered = await client.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
    }
  });

  if (alreadyRegistered) {
    // Bad request. Already registered.
    return res.status(400).json({ ok: false, message: "Already registered user." });
  } else {
    const saltRounds = Number.parseInt(process.env.PASSWORD_SALT_ROUND || "10")
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const userInfo = {
      email,
    }
    const user = await client.user.create({
      data: {
        ...userInfo,
        password: passwordHash,
      },
    });
    if (user) {
      return res.status(201).json({ ok: true, user: userInfo });
    } else {
      return res.status(500).json({ ok: false, message: "Cannot create user." });
    }
  }
}

export default withMethodGuard({ methods: ["POST"], handler });
