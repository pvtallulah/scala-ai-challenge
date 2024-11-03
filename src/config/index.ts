export const config = {
  env: (process.env.NODE_ENV || "development") as string,
  dataUrl: process.env.DATA_URL as string,
  useLocalData: process.env.USE_LOCAL_DATA === "true",
};
