let instance = null;
export const setLenis = (l) => { instance = l; };
export const getLenis = () => instance;
export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;