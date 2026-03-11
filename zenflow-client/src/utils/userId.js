// Persistent anonymous user ID stored in localStorage
export const getUserId = () => {
  let id = localStorage.getItem('zenflow_uid');
  if (!id) {
    id = 'zf_' + Math.random().toString(36).slice(2, 11) + Date.now();
    localStorage.setItem('zenflow_uid', id);
  }
  return id;
};
