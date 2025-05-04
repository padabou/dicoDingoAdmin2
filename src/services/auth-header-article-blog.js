export default function authHeaderBlog() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
      return {
        Authorization: 'Bearer ' + user.accessToken,
        'Access-Control-Allow-Origin' : '*',
        'Content-Type': 'multipart/form-data'};
    } else {
      return {};
    }
  }
