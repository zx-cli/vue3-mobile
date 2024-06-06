const setUserInfo = (data: any) => {
  sessionStorage.setItem('userInfo', JSON.stringify(data));
};

const getUserInfo = () => {
  if (sessionStorage.getItem('userInfo')) {
    return JSON.parse(sessionStorage.getItem('userInfo') as string);
  } else {
    return {};
  }
};

const isAdmin = () => {
  const roles = getUserInfo()?.roles || [];
  if (roles.includes('baoxiu')) return true;
  return false;
};

const setToken = (token: string) => {
  sessionStorage.setItem('token', token);
};

const getToken = () => {
  return sessionStorage.getItem('token');
};

const loginOut = () => {
  sessionStorage.setItem('token', '');
  sessionStorage.setItem('userInfo', '');
};

export { setUserInfo, getUserInfo, setToken, getToken, loginOut };
