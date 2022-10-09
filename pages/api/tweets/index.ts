import client from "../../../lib/server/client";
import type { NextApiRequest, NextApiResponse } from "next";
import withMethodGuard from "lib/server/withMethodGuard";
import { withApiSession } from "lib/server/withSession";

interface TweetWithUser {
  id: number;
  message: string;
  user: {
    email: string;
  };
  _count?: {
    likes: number;
  };
  ILiked?: boolean;
}

export interface TweetResponse {
  ok: boolean;
  message?: string;
  tweet?: TweetWithUser;
}

export interface TweetsResponse {
  ok: boolean;
  message?: string;
  tweets?: TweetWithUser[];
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetResponse | TweetsResponse>
) {
  const id = req.session.user?.id;

  if (!id) {
    return res.status(403).json({ ok: false, message: "Login please" });
  }

  if (req.method === "POST") {
    const {
      body: { tweet },
    } = req;

    if (!tweet) {
      return res.status(400).json({ ok: false, message: "No tweet" });
    }

    const aTweet = await client.tweet.create({
      data: {
        message: tweet,
        user: {
          connect: {
            id: +id.toString(),
          },
        },
      },
      select: {
        id: true,
        message: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (aTweet) {
      res.status(201).json({ ok: true, tweet: aTweet });
    } else {
      res.status(500).json({ ok: false, message: "Cannot tweet" });
    }
  }

  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const itemsPerPage = +(process.env.ITEMS_PER_PAGE || 20);
    const pageNum = (page && +page.toString() - 1) || 0;
    const tweets = await client.tweet.findMany({
      take: itemsPerPage,
      skip: itemsPerPage * pageNum,
      select: {
        id: true,
        message: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (tweets) {
      const myLikes = await client.like.findMany({
        where: {
          tweetId: {
            in: tweets.map((t)=>t.id),
          },
          userId: +id.toString(),
        },
        select: {
          tweetId: true,
        }
      })

      const tweetsWithMyLikes = tweets.map((t)=>{
        return {
          ...t,
          ILiked: myLikes.map((l)=>{return l.tweetId}).includes(t.id)
        }
      })
      return res.status(201).json({ ok: true, tweets: tweetsWithMyLikes });
    } else {
      return res.status(500).json({ ok: false, message: "Cannot tweet" });
    }
  }
}

export default withApiSession(
  withMethodGuard({ methods: ["GET", "POST"], handler })
);
