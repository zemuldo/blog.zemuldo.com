module.exports = {
    apps : [
        {
          name: "Blog Server 0 8070",
          script: "./app.js",
          watch: true,
          env: {
              "PORT": 8070,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 8070,
              "NODE_ENV": "production",
          }
        }
    ]
  }