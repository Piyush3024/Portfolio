// Enum Types (matching Prisma schema)
export const RoleType = {
    ADMIN: 'ADMIN',
    USER: 'USER'
  };
  
  // API Endpoints
  // Add this to your API_ENDPOINTS object
  export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    
    // Users
    USERS: '/users/users',
    USER: (id) => `/users/${id}`,
    
    // Contacts
    CONTACTS: '/contact/',
    CONTACT: (id) => `/contact/${id}`,
    
    // Projects
    PROJECTS: '/project',
    PROJECT: (id) => `/project/${id}`,
    
    // Blog
    POSTS: '/post/published',
    POST: (id) => `/post/${id}`,
    POST_BY_SLUG: (slug) => `/post/slug/${slug}`,
    
    // Comments
    COMMENTS: '/comment',
    COMMENT: (id) => `/comment/${id}`,
    POST_COMMENTS: (postId) => `/comment/post/${postId}/`,
  
    REFRESH_TOKEN: '/refresh-token',
  };