import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: string;
    };
  }
}

const ttl = process.env.SESSION_TTL_IN_SEC
  ? parseInt(process.env.SESSION_TTL_IN_SEC)
  : 60 * 60;

const sessionConfigs = {
  cookieName: (process.env.APP_NAME || "tweeter") + "_session",
  password: (process.env.SESSION_SECRET || "THIS_IS_DEMO_SESSION_SECRET._PLEASE_ADD_PRODUCTION_LEVEL_SECRET."),
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  ttl,
};

export function withApiSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionConfigs);
}
