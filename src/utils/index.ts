export const isLoad = (url: string, noloadList: any[]) => {
  for (const i of noloadList) {
    if (url.startsWith(i)) {
      return false;
    }
  }
  return true;
};
