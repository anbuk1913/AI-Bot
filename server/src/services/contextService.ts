import User, { IContext } from "../models/Context";

export const saveHistory = async (
  userId: string,
  newItem: string
): Promise<IContext | null> => {
  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({
        userId,
        history: [newItem],
      });
    } else {
      if (user.history.length >= 50) {
        user.history.pop();
      }
      if(!(user.history.includes(newItem))){
        user.history.unshift(newItem);
      }
    }
    await user.save();
    return user;
  } catch (error) {
    console.error("Error adding history item:", error);
    throw error;
  }
};

export const saveContext = async (
  userId: string,
  newItem: string
): Promise<IContext | null> => {
  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({
        userId,
        user: [newItem],
      });
    } else {
      if (user.context.length >= 50) {
        user.context.pop();
      }
      if(!(user.context.includes(newItem))){
        user.context.unshift(newItem);
      }
    }
    await user.save();
    return user;
  } catch (error) {
    console.log("Error adding contex item:",error);
    throw error;
  }
}

export const getContextHistory = async (
  userId: string
): Promise<IContext | null> => {
  try {
    const context = await User.findOne({ userId });
    return context;
  } catch (error) {
    console.error("Error fetching context history:", error);
    throw error;
  }
};

export const addContextService = async(
  userId: string,
  context: string
 ): Promise<boolean> => {
  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({
        userId,
        context: [context],
      });
    } else {
      if (user.context.length >= 50) {
        user.context.pop();
      }
      if(!(user.context.includes(context))){
        user.context.unshift(context);
      }
    }
    await user.save();
    return true
  } catch (error) {
    console.log(error);
    return false
  }
 }

export const removeContextService = async(
  userId: string,
  context: string,
 ): Promise<boolean> => {
  try {
    let user = await User.findOne({ userId });
    if(user?.context && user.context?.length){
      let tem = false
      for(let i=0;i<user.context.length;i++){
        if(!tem){
          if(user.context[i]==context){
            tem = true
            if(i+1<user.context.length){
              user.context[i] = user.context[i+1]
            } else {
              break
            }
          }
        } else {
          if(i+1<user.context.length){
            user.context[i] = user.context[i+1]
          } else {
            break
          }
        }
      }
      if(tem){
        user.context.pop()
        await user.save()
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
    return false
  }
}

export const getContextData = async(
  userId: string
): Promise<IContext | null> => {
  try {
    const context = await User.findOne({ userId });
    return context;
  } catch (error) {
    console.error("Error fetching context history:", error);
    throw error;
  }
};