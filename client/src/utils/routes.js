const routes = {
    home: '/',
    login: '/login',
    register: '/register',
    todos: '/',
    forgetPassword: '/forget-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify',
};

export const publicRoutes = [routes.login, routes.register];

export default routes;
