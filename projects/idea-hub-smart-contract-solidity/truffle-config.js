module.exports = {
    contracts_directory: "./contracts",
    contracts_build_directory: "./build/tmp/truffle",
    migrations_directory: "./migrations",
    tests_directory: "./test",

    // Uncommenting the defaults below
    // provides for an easier quick-start with Ganache.
    // You can also follow this format for other networks;
    // see <http://truffleframework.com/docs/advanced/configuration>
    // for more details on how to specify configuration options!
//    networks: {
//      test: {
//        url: "https://ethereum.sireto.io/rinkeby",
//        network_id: "*"
//      }
//    },

//     compilers: {
//         solc: {
//             version: "0.5.8"  // ex:  "0.4.20". (Default: Truffle's installed solc)
//     }
// }

    compilers: {
        solc: {
            version: "0.6.12", // A version or constraint - Ex. "^0.5.0"
            // Can also be set to "native" to use a native solc
            docker: false, // Use a version obtained through docker
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200   // Optimize for how many times you intend to run the code
                },
                // evmVersion: < string > // Default: "byzantium"
            }
        }
    }
};
