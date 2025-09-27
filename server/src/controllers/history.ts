import { getContextHistory } from '../services/contextService'
import { Request, Response, NextFunction } from 'express';

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userid } = req.params;
    if (userid) {
      const his = await getContextHistory(userid);
      if (!his) {
        return res.json({
          success: false,
          message: "No history found for this user"
        });
      }
      return res.json({
        success: true,
        data: his.data
      });
    } else {
      res.json({
        success: false,
        message: "userId is required"
      });
    }
  } catch (error) {
    next(error);
  }
};
