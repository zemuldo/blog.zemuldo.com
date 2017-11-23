module.exports = {
    pages:{
        dev:{
            name:'Development',
            icon:'code',
            topTitle:"Dev articles"
        },
        tech:{
            name:'Technology',
            icon:'server',
            topTitle:" Featured in Technology"
        },
        business:{
            name:'Business',
            icon:'creative commons',
            topTitle:" Popular in Bsuness"
        },
        reviews:{
            name:'Reviews',
            icon:'circle notched'
        },
        tuts:{
            name:'Tutorials',
            icon:'code',
            topTitle:" Popular Tutorials"
        },
        home:{
            name:'Home',
            icon:'home'
        },
        profile:{
            name:'Profile',
            icon:'user circle'
        },
        about:{
            name:'About',
            icon:'info'
        },
        login:{
            name:'Login',
            icon:'lock'
        }
    },
    live:{
        httpPort:8080,
        wsURL:'ws://zemuldo.com:8090',
        httpURL:'https://api.zemuldo.com',
        serverURL:'https://zemuldo.com'
    },
    production:{
        httpPort:8080,
        wsURL:'ws://zemuldo.com:8090',
        httpURL:'https://api.zemuldo.com',
        serverURL:'https://zemuldo.com'
    },
    dev:{
        httpPort:8080,
        wsURL:'ws://localhost:8090',
        httpURL:'http://localhost:8090',
        serverURL:'https://localhost:8080'
    },
    development:{
        httpPort:8080,
        wsURL:'ws://localhost:8090',
        httpURL:'http://localhost:8090',
        serverURL:'https://localhost:8080'
    }
}