import { getContextHistory, removeContextService, addContextService, getContextData } from '../services/contextService'
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
        data: his.history,
        context: his.context
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

export const addContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const { context } = req.body
    if(userId){
      const result:boolean = await addContextService(userId,context)
      if(result){
        return res.json({
          success: true,
        });
      } else {
        return res.json({
          success: false,
        });
      }
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export const removeContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const  userId:string = req.params.userid
    const context:string = req.body.context
    if(userId){
      const result:boolean = await removeContextService(userId,context)
      if(result){
        res.json({
          success: true,
        })
      } else {
        res.json({
          success: false,
        })
      }
    } else {
      res.json({
        success: false,
      })
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export const getContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const his = await getContextData(userId);
      if (!his) {
        return res.json({
          success: false,
          message: "No history found for this user"
        });
      }
      return res.json({
        success: true,
        message: "No history found for this user",
        data: his.context
      });
    } else {
      res.json({
        success: false,
        message: "userId is required"
      });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}