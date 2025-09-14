export const config = {
    port: process.env.PORT || 5000,
    // openaiApiKey: process.env.OPENAI_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL,
    nodeEnv: process.env.NODE_ENV || 'development',
};