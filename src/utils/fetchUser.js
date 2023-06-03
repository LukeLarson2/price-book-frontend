export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("userData") !== "undefined"
      ? JSON.parse(localStorage.getItem("userData"))
      : localStorage.clear();

  return userInfo;
};
