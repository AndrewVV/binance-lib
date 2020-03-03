require('dotenv').config();
const BnbApiClient = require('@binance-chain/javascript-sdk');
const crypto = BnbApiClient.crypto;
const api = process.env.API_DEV; /// api string
const mnemonic = process.env.MNEMONIC;
const privKey = process.env.PRIVKEY
const prefix = 'tbnb' // if maiinet "bnb"
const address = "tbnb1tc99ms7zllkhtwhmtvp37md6wrfund06cj37ns" // testnet
const address2 = "tbnb16enrf8gzrclphmpjeyfvufq8j0wr7u9v6lsz82" // testnent

class BinanceLib {
    constructor(api){
        this.bnbClient = new BnbApiClient(api);
        this.getBalance(address)
        // this.getAccount(address)
        // this.sendTx(address, address2, 1, 'BNB', "memooooooooooo")
        // this.getTxHistory(address)
        // this.createAccount()
        // this.getPrivateKeyFromMnemonic(mnemonic)
        // this.getAddressFromPrivateKey(privKey)
        // this.validateAddress(address)
    }

    validateAddress(address){
        return crypto.checkAddress(address, prefix)
    }
    
    async getBalance(address){
        let balance = await this.bnbClient.getBalance(address)
        console.log(balance)
        return balance[0].free;
    }

    async sendTx(from, to, amount, asset, memo){
        await this.bnbClient.initChain()
        await this.bnbClient.setPrivateKey(privKey)
        let sequence = await this.getAccount(from)
        let result = await this.bnbClient.transfer(from, to, amount, asset, memo, sequence)
        console.log(result)
        let txHash = result.result[0].hash
        console.log(txHash)
        return txHash
    }

    async getTxHistory(address){
        let result = [];
        let allTx = await this.bnbClient.getTransactions(address)
        allTx = allTx.result.tx
        for(let txKey in allTx){
			let tx = allTx[txKey];
            let hash = tx.txHash;
			let amount = tx.value;
			let symbol = tx.txAsset;
			let memo = tx.memo;
			let from = tx.fromAddr;
			let to = tx.toAddr;
			let typeOperation = tx.txType;
			let timestamp = tx.timeStamp;
            let blockNumber = tx.blockHeight;
            let txFee = tx.txFee;
			let txData = this.formatTxData(hash, amount, symbol, memo, from, to, typeOperation, timestamp, blockNumber, txFee);
			result.push(txData)
		}
		console.log(result)
        return result
    }

    formatTxData(hash, amount, symbol, memo, from, to, typeOperation, timestamp, blockNumber, txFee){
		let txData = {
			txHash: hash,
			amount,
			ticker: symbol, 
			memo,
			from,
			to,
			typeOperation,
			timestamp,
            blockNumber,
            txFee,
		};
		return txData;
    }
    
    async getAccount(address){
        let result = await this.bnbClient.getAccount(address)
        let sequence = result.result.sequence
        return sequence;
    }

    createAccount() {
        const privateKey = crypto.generatePrivateKey();
        const address = crypto.getAddressFromPrivateKey(privateKey, prefix)
        console.log(privateKey, address)
        return {
            privateKey,
            address
        }
    }

    getPrivateKeyFromMnemonic(mnemonic){
        let privKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
        console.log("privKey", privKey)
        return privKey;
    }

    getAddressFromPrivateKey(privKey){
        let address = crypto.getAddressFromPrivateKey(privKey, prefix);
        console.log("address", address)
        return address;
    }
}
let binanceLib = new BinanceLib(api)