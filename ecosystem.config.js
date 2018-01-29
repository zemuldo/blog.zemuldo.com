module.exports = {
    apps : [
        {
          name: "Server 0",
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
        },
        {
            name: "Server 1",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8071,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8071,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Server 2",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8072,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8072,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Server 3",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8073,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8073,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Server 4",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8073,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8074,
                "NODE_ENV": "production",
            }
        }
    ]
  }