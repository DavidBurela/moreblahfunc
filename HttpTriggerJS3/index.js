module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /// Assumes you are running `truffle develop` in another terminal window

    // Import our contract artifacts and turn them into usable abstractions.
    var contract = require("truffle-contract");
    var rwgtoken_artifacts = require('./RwgToken.json');
    var RwgToken = contract(rwgtoken_artifacts);

    // set the provider to a read only version
    var Web3 = require("web3");
    var rpcEndpoint = "http://japeig-dns-reg1.japaneast.cloudapp.azure.com:8545";
    RwgToken.setProvider(new Web3.providers.HttpProvider(rpcEndpoint));

    var account = "0x627306090abab3a6e1400e9345bc60c78a8bef57"; // truffle develop account 0
    var rwgToken;
    console.log("STARTING THE FUNCTION");
    RwgToken.deployed().then(function (instance) {
        rwgToken = instance;
        console.log("GOT CONTRACT AT: " + rwgToken.address);
        return rwgToken.balanceOf.call(account, { from: account });
    }).then(function (value) {
        console.log("PLAYER HAS : " + value.valueOf()) + " TOKENS";
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + value.valueOf()
        };
        context.done();
    }).catch(function (e) {
        console.log(e);
        //self.setStatus("Error getting balance; see log.");
        context.done();
    });

};