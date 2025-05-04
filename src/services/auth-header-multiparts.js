export default function authHeaderMultiPart() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken,
      'Access-Control-Allow-Origin' : '*',
      "Content-Type": "multipart/form-data;"}; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}