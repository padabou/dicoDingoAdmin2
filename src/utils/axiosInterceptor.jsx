import axios from "axios";

// Create the axios instance
export const axiosInstanceSecure = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_BASE_URL,
});

/**
 * This function sets up the axios interceptors.
 * It should be called once in the main entry point of the application (e.g., main.jsx or App.jsx).
 * @param {object} navigate - The navigate function from react-router-dom.
 */
const setupAxiosInterceptors = (navigate) => {
  const resInterceptor = (response) => {
    return response;
  };

  const errInterceptor = (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // Redirect to the login page
      // We use a simple window.location.replace here because this function
      // is outside the React component tree. This is a clean way to handle
      // a hard redirect on authentication failure.
      navigate('/login');
    }

    return Promise.reject(error);
  };

  // Add the response interceptor
  axiosInstanceSecure.interceptors.response.use(resInterceptor, errInterceptor);
};

export { setupAxiosInterceptors };
