export const config = {
  env: (process.env.NODE_ENV || "development") as string,
  port: +(process?.env?.PORT || 3000) as number,
  dataUrl: process.env.DATA_URL as string,
};
