module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

/// Assumes you are running `truffle develop` in another terminal window

// Import our contract artifacts and turn them into usable abstractions.
var contract = require("truffle-contract");
var rwgtoken_artifacts = require('./RwgToken.json');
var RwgToken = contract(rwgtoken_artifacts);

// import the HD wallet for the admin (using the truffle develop default)
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
var rpcEndpoint = "http://japeig-dns-reg1.japaneast.cloudapp.azure.com:8545";
var rwgWallet = new HDWalletProvider(mnemonic, rpcEndpoint, 0); // unlock account 0
RwgToken.setProvider(rwgWallet);

// accounts to send from -> to
var account = rwgWallet.address; // truffle develop account 0
var receivingAccount = "0xf17f52151ebef6c7334fad080c5704d77216b732"; // a player account to send to

// send the token
var rwgToken;
RwgToken.deployed().then(function (instance) {
    rwgToken = instance;
    // send 100 tokens
    console.log("starting transfer");
    return rwgToken.transfer(receivingAccount, 100, { from: account });
}).then(function (txReceipt) {
    console.log(txReceipt.valueOf());
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "TX Id " + txReceipt.valueOf()
    };
    context.done();    
}).catch(function (e) {
    console.log(e);
    self.setStatus("Error getting balance; see log.");
    context.done();
    context.res = {
        status: 500, /* Defaults to 200 */
        body: e
    };
});


};