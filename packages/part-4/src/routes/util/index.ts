import { RouteType } from '../../helper/route';
import { useSearchParam } from '../../helper/searchParams';
import { z } from 'zod';

const route: RouteType = {
  util: {
    get: (req, res) => {
      const params = useSearchParam(req);
      const validate = z.object({ str: z.string().min(1).max(256) });

      const result = validate.safeParse(params);
      if (!result.success) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify(
            { message: 'invalid params', meta: result.error.issues },
            null,
            2
          )
        );
      }

      res.statusCode = 200;
      return res.end(
        JSON.stringify(
          {
            data: {
              length: result.data.str.length,
              word: result.data.str,
            },
          },
          null,
          2
        )
      );
    },
  },
};

export default route;
