import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./cookies";
import { clearTokens } from "./auth";

// API BASE URL AND REFRESH ENDPOINT
const apiBaseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/`;


const refreshEndpoint = `${apiBaseURL}/token/refresh/`;

// FLAGS AND QUEUE FOR TOKEN REFRESH
let isRefreshing = false;
const refreshQueue: { (): void; (value: void | PromiseLike<void>): void }[] =
  [];

// AXIOS INSTANCE WITH BASE URL
const api = axios.create({
  baseURL: apiBaseURL,
  headers: { "Content-Type": "application/json" },
});

// FUNCTION TO REFRESH ACCESS TOKEN
const refreshAccessToken = async (refreshToken: string | null) => {
  try {
    const response = await axios.post(refreshEndpoint, {
      refresh: refreshToken,
    });

    return response.data; // RETURN THE ENTIRE RESPONSE OBJECT (CONTAINS BOTH ACCESS AND REFRESH TOKENS)
  } catch (error) {
    // console.error("Error refreshing access token:", error);
    // console.log("Redirect to login..............");

    // FOR SIGNOUT
    handleClearWeb();

    throw error; // RETHROW THE ERROR SO THAT THE ORIGINAL REQUEST CAN HANDLE IT
  } finally {
    // RESET THE ISREFRESHING FLAG ONCE THE REFRESH IS COMPLETE
    isRefreshing = false;

    // PROCESS ANY QUEUED REQUESTS THAT WERE WAITING FOR THE REFRESH TO COMPLETE
    while (refreshQueue.length > 0) {
      const queuedRequest: any = refreshQueue.shift();
      queuedRequest();
    }
  }
};

// ADD A REQUEST INTERCEPTOR TO HANDLE TOKEN REFRESHING
api.interceptors.request.use(
  async (config) => {
    // WAIT FOR THE TOKEN REFRESH TO COMPLETE
    await waitForTokenRefresh();

    // ADD YOUR LOGIC TO INCLUDE THE ACCESS TOKEN IN THE REQUEST HEADERS
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ADD A RESPONSE INTERCEPTOR TO HANDLE TOKEN EXPIRATION
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // CHECK IF THE ERROR IS DUE TO AN EXPIRED TOKEN
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // GET THE REFRESH TOKEN FROM WHEREVER YOU STORE IT (LOCALSTORAGE, ETC.)
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      if (refreshToken || accessToken) {
        // CHECK IF A REFRESH IS ALREADY IN PROGRESS
        if (!isRefreshing) {
          isRefreshing = true;

          // ATTEMPT TO REFRESH THE ACCESS TOKEN
          try {
            const refreshResponse = await refreshAccessToken(refreshToken);

            // UPDATE THE ORIGINAL REQUEST WITH THE NEW TOKEN
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.access}`;

            // UPDATE THE STORED REFRESH TOKEN IF IT HAS CHANGED
            if (refreshResponse.refresh || refreshResponse.access) {
              // UPDATE THE STORED REFRESH TOKEN WITH THE NEW ONE
              // ASSUMING YOU HAVE A SETREFRESHTOKEN FUNCTION IN YOUR COOKIES MODULE
              setRefreshToken(refreshResponse.refresh);
              setAccessToken(refreshResponse.access);
            }

            // RETRY THE ORIGINAL REQUEST WITH THE NEW TOKEN
            return api(originalRequest);
          } catch (refreshError) {
            // HANDLE REFRESH ERROR, E.G., REDIRECT TO LOGIN PAGE
            // console.error("Error refreshing access token:", refreshError);

            // FOR SIGNOUT
            handleClearWeb();
            // EXAMPLE REDIRECT TO LOGIN PAGE IN NEXT.JS
          } finally {
            // RESET THE _RETRY FLAG FOR THE ORIGINAL REQUEST
            originalRequest._retry = false;
          }
        } else {
          // IF A REFRESH IS ALREADY IN PROGRESS, QUEUE THE REQUEST TO BE RETRIED
          const retryOriginalRequest = new Promise((resolve, reject) => {
            refreshQueue.push(() => {
              api(originalRequest).then(resolve).catch(reject);
            });
          });

          return retryOriginalRequest;
        }
      } else {
        // REDIRECT TO THE LOGIN PAGE OR HANDLE THE USER BEING LOGGED OUT
        // console.error("Refresh token is missing. Redirecting to login.");

        // FOR SIGNOUT
        handleClearWeb();
        window.location.replace("/");
        // EXAMPLE REDIRECT TO LOGIN PAGE IN NEXT.JS
      }
    }

    return Promise.reject(error);
  }
);

// FOR SIGNOUT
const handleClearWeb = () => {
  removeAccessToken();
  removeRefreshToken();
  clearTokens()
  location.reload();
};

// FUNCTION TO WAIT FOR THE TOKEN REFRESH TO COMPLETE
const waitForTokenRefresh = () => {
  return new Promise<void>((resolve) => {
    // IF A REFRESH IS IN PROGRESS, QUEUE THE REQUEST TO BE RESOLVED WHEN REFRESH IS COMPLETE
    if (isRefreshing) {
      refreshQueue.push(resolve);
    } else {
      resolve();
    }
  });
};

// EXPORT THE AXIOS INSTANCE
export default api;
