import client from "../../../lib/server/client"
import type { NextApiRequest, NextApiResponse } from "next";
import withMethodGuard from "../../../lib/server/withMethodGuard";
import { withApiSession } from "../../../lib/server/withSession";

export type TweetLikeResponse = {
  ok: boolean;
  message?: string;
  liked?: boolean;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetLikeResponse>
) {
  const userId = req.session.user?.id;
  const { tweetId } = req.body

  if (!userId) {
    return res.status(403).json({ ok: false, message: "Please Log in." });
  }

  if (!tweetId) {
    return res.status(403).json({ ok: false, message: "Specify tweetId" });
  }

  const like = await client.like.findFirst({
    where: {
      tweetId: +tweetId,
      userId: +userId,
    },
    select: {
      id: true
    }
  })

  if(!like) {
    await client.like.create({
      data: {
        tweetId: +tweetId,
        userId: +userId,   
      }
    })
    return res.status(201).json({ok: true, liked: true})
  } else {
    await client.like.delete({
      where: {
        id: like.id
      }
    })
    return res.status(201).json({ok: true, liked: false})
  }
}

export default withApiSession(withMethodGuard({ methods: ["POST"], handler }));
