/**
 * Apply middleware to the application. Mutates the app passed in
 * @param {Array} middleware - array of middleware wrapper functions
 * @param {Object} app - express application
 */
export const applyMiddleware = (middleware, app) => {
  for (const wrapper of middleware) {
    wrapper(app);
  }
};

/**
 * Register routes with the application. Mutates the app passed in.
 * @param {Array} routes - array of route objects
 * @param {Object} app - express application
 */
export const applyRoutes = (routes, app) => {
  for (const router of routes) {
    const { prefix, endpoints } = router;
    app.use(prefix, endpoints);
  }
};