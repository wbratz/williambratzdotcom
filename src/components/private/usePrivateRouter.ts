export function usePrivateRouter() {
  return {
    asPath:
      typeof window === "undefined"
        ? "/secret/admin"
        : window.location.pathname,
    async replace(destination: string) {
      window.location.replace(destination);
    },
  };
}
