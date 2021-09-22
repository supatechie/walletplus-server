export default {
  /**
   * NODE ENVIRONMENT
   */
  environment: process.env.NODE_ENV,
  /**
   * server port
   */
  port: parseInt(process.env.APP_PORT as any, 10) || 5000,
  /**
   * Domain url
   */
  domain:  process.env.NODE_ENV === "production" ? process.env.SITE_DOMAIN : process.env.DOMAIN,
  /**
   * Private keys
   */
   privateKey: process.env.PRIVATE_KEY,
   /**
    * Public key
    */
   publicKey: process.env.PUBLIC_KEY,
   /**
    * Mail config
    */
    mailConfig:{
        port: process.env.NODE_ENV === "production" ? parseInt(process.env.MAIL_PORT as any,10): 587,
        host: process.env.MAIL_HOST,
        account: {
            user: process.env.MAIL_ACCOUNT_USER,
            pass: process.env.MAIL_ACCOUNT_PWD,
        }
    },
    site: {
        /**
         * the domain of the site
         */
        domain: process.env.SITE_DOMAIN,
        /**
         * main site url
         */
        siteUrl: process.env.SITE_URL,
        /**
         * API url
         */
        apiUrl: process.env.API_URL,
        /**
         * API path e.g /api
         */
        apiPath: process.env.API_PATH,
    },
    mongo: {
        mongodb_ur: process.env.NODE_ENV === "production" ? process.env.MONGO_DB_REMOTE_URL : process.env.MONGO_DB_LOCAL_URL,
        mongodb_test_url: process.env.MONGO_DB_TEST_URL
    }
};
