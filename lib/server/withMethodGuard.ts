import type { NextApiRequest, NextApiResponse } from 'next'

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = 'POST' | 'GET';

interface HandlerArgs {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
}

export default function withMethodGuard({
  methods,
  handler
}: HandlerArgs) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method && !methods.includes(req.method as any)) {
      res.status(405).json({ok: false, message: 'Method is not allowed.'});
    }

    try {
      handler(req, res);
    } catch (e) {
      console.error(e);
      res.status(500).json({ok: false, message: 'server error'});
    }
  };
}
