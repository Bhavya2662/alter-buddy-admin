export const baseQuery = {
     baseUrl: process.env.REACT_APP_URL,
     prepareHeaders: (headers: Headers) => {
          const token = localStorage.getItem("ADMIN");
          if (token) {
               headers.set("Authorization", `Bearer ${token}`);
          }
     },
};
