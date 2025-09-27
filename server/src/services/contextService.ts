import Context, { IContext } from "../models/Context";

export const saveContext = async (
  userId: string,
  newItem: string
): Promise<IContext | null> => {
  try {
    let context = await Context.findOne({ userId });

    if (!context) {
      context = new Context({
        userId,
        data: [newItem],
      });
    } else {
      if (context.data.length >= 3) {
        context.data.pop();
      }
      if(!(context.data.includes(newItem))){
        context.data.unshift(newItem);
      }
    }
    await context.save();
    return context;
  } catch (error) {
    console.error("Error adding context item:", error);
    throw error;
  }
};

export const getContextHistory = async (
  userId: string
): Promise<IContext | null> => {
  try {
    const context = await Context.findOne({ userId });
    return context;
  } catch (error) {
    console.error("Error fetching context history:", error);
    throw error;
  }
};