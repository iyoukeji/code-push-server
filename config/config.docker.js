var config = {};
config.development = {
  // Config for database, only support mysql.
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: "mysql"
  },
  // Config for qiniu (http://www.qiniu.com/) cloud storage when storageType value is "qiniu".
  qiniu: {
    accessKey: process.env.QINIU_ACCESS_KEY,
    secretKey: process.env.QINIU_SECRET_KEY,
    bucketName: process.env.QINIU_BUCKET_NAME,
    downloadUrl: process.env.QINIU_DOWNLOAD_URL, // Binary files download host address.
  },
  // Config for Amazon s3 (https://aws.amazon.com/cn/s3/) storage when storageType value is "s3".
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION,
    downloadUrl: process.env.S3_DOWNLOAD_URL, // binary files download host address.
  },
  // Config for Aliyun OSS (https://www.aliyun.com/product/oss) when storageType value is "oss".
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    secretAccessKey: process.env.OSS_SECRET_ACCESS_KEY,
    endpoint: process.env.OSS_ENDPOINT,
    bucketName: process.env.OSS_BUCKET_NAME,
    prefix: process.env.OSS_PREFIX, // Key prefix in object key
    downloadUrl: process.env.OSS_DOWNLOAD_URL, // binary files download host address.
  },
  // Config for local storage when storageType value is "local".
  local: {
    // Binary files storage dir, Do not use tmpdir and it's public download dir.
    storageDir: process.env.LOCAL_STORAGE_DIR,
    // Binary files download host address which Code Push Server listen to. the files storage in storageDir.
    downloadUrl: process.env.LOCAL_DOWNLOAD_URL,
    // public static download spacename.
    public: process.env.LOCAL_PUBLIC
  },
  jwt: {
    // Recommended: 63 random alpha-numeric characters
    // Generate using: https://www.grc.com/passwords.htm
    tokenSecret: process.env.JWT_TOEKN_SECRET,
  },
  common: {
    /*
     * tryLoginTimes is control login error times to avoid force attack.
     * if value is 0, no limit for login auth, it may not safe for account. when it's a number, it means you can
     * try that times today. but it need config redis server.
     */
    tryLoginTimes: parseInt(process.env.COMMON_TRY_LOGIN_TIMES, 10) || 0,
    // CodePush Web(https://github.com/lisong/code-push-web) login address.
    //codePushWebUrl: "http://localhost:3001/login",
    // create patch updates's number. default value is 3
    diffNums: parseInt(process.env.COMMON_DIFF_NUMS, 10) || 3,
    // data dir for caclulate diff files. it's optimization.
    dataDir: process.env.COMMON_DATA_DIR,
    // storageType which is your binary package files store. options value is ("local" | "qiniu" | "s3")
    storageType: process.env.COMMON_STORAGE_TYPE || "local",
    // options value is (true | false), when it's true, it will cache updateCheck results in redis.
    updateCheckCache: !!process.env.COMMON_UPDATE_CHECK_CACHE
  },
  // Config for smtp email，register module need validate user email project source https://github.com/nodemailer/nodemailer
  smtpConfig:{
    host:  process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: !!process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    }
  },
  // Config for redis (register module, tryLoginTimes module)
  redis: {
    default: {
      host: process.env.REDIS_DEFAULT_HOST,
      port: parseInt(process.env.REDIS_DEFAULT_PORT, 10) || 6379,
      retry_strategy: function (options) {
        if (options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
      }
    }
  }
}
config.production = Object.assign({}, config.development);
module.exports = config;
