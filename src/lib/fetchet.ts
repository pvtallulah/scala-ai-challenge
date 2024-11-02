export const fetcher = <T>(...args: Parameters<typeof fetch>): Promise<T> =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json() as Promise<T>;
  });
