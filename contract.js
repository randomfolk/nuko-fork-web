/*global ethereum, MetamaskOnboarding */

//import Web3 from 'web3';
//import MetaMaskOnboarding from '@metamask/onboarding'
//import mergeImages from '/merge-images'

const forwarderOrigin = 'http://nekonium.xyz'
const contractStatus = document.getElementById('contractStatus')
const claimButton = document.getElementById('claimButton')
var accounts = [];
var tx_data ;
var claim_acc_final ;
var global_contract;
function search_address_and_update(address){

    //contractStatus.innerHTML= address;
    var item = json_data.transactions.find(item => item[0].toLowerCase() === address.toLowerCase());

    if (item){
        contractStatus.innerHTML= "Address found in snapshot: <br> <span style=\"color: red; font-weight: bold;\"> "  + address + " </span> <br> Balance:  <span style=\"color: red; font-weight: bold;\">  " + item[3]+ "</span> NUKO <br>"  +  "Tx data to claim: " + item[2]
        document.getElementById("claim-button-text").innerHTML="Clicking this Claim button will claim " + item[3] +" nuko for address: " + item[0] + " <br> Gas fee is paid by your address: " + address;
        tx_data = item[2];
        claim_acc_final = item[0];
        claimButton.disabled = false;
    } else {
        contractStatus.innerHTML= "Cannot find this address in the snapshot, please check your address in the above input field, it must have NUKO";
        claimButton.disabled = true;
    }

}

const initialize = () => {
  //You will start here
  const onboardButton = document.getElementById('connectButton');

  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');

  //contract

  const depositButton = document.getElementById('depositButton')
  const withdrawButton = document.getElementById('withdrawButton')
  const contractStatus = document.getElementById('contractStatus')

  const networkDiv = document.getElementById('network')
  const chainIdDiv = document.getElementById('chainId')
  const accountsDiv = document.getElementById('accounts')

  //const contractAddress = '0x072EDd344a9d1Bb558df00D265B4fC9a4E3a4893';
  const contractAddress = '0x2D6F0aF8e7be65821811Fb2B1A937687E8c8A46E'; //truffle test

  var contract ;
  //var accounts;

  // Send Eth Section
  const sendButton = document.getElementById('sendButton')

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };
  const MetaMaskClientCheck = () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;

    } else {
      //If it is installed we change our button text
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };

  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };
  function decode_addr (addr) {
    var results = [];
    if (addr.length != 42){
      results.push(-1);

    }else{
      /*
      'body' => rand(1,16),
      'fur' => rand(1,10),
      'eyes' => rand(1,15),
      'mouth' => rand(1,10),
      'accessorie' => rand(1,20)
      */
      results.push(parseInt(addr.substring(40),16) %16 + 1);
      results.push(parseInt(addr.substring(38,40),16) %10 + 1);
      results.push(parseInt(addr.substring(36,38),16) %15 + 1);
      results.push(parseInt(addr.substring(34,36),16) %10 + 1);
      results.push(parseInt(addr.substring(32,34),16) %20 + 1);
    }
    return results;
  };
  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      var ABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "_caller",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint128",
              "name": "_caller_reword",
              "type": "uint128"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "_account",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint128",
              "name": "_snapshot",
              "type": "uint128"
            }
          ],
          "name": "MakeSnapshot",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "_from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "BURN_ADDRS",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "CALLER_PROFIT",
          "outputs": [
            {
              "internalType": "uint128",
              "name": "",
              "type": "uint128"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "FORK_HEIGHT",
          "outputs": [
            {
              "internalType": "uint32",
              "name": "",
              "type": "uint32"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "PROOF_ADDRS",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "SIGN_MESSAGE",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "snapshotOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "snapshot",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_target",
              "type": "address"
            }
          ],
          "name": "hasSnapshot",
          "outputs": [
            {
              "internalType": "bool",
              "name": "_hasSnapshot",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "_tx",
              "type": "bytes"
            }
          ],
          "name": "makeSnapshot",
          "outputs": [
            {
              "internalType": "int256",
              "name": "success",
              "type": "int256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      contract = new web3.eth.Contract(ABI, contractAddress);
      global_contract = contract;
      //contract = new web3.eth.Contract([{ 'constant': false, 'inputs': [{ 'name': 'withdrawAmount', 'type': 'uint256' }], 'name': 'withdraw', 'outputs': [{ 'name': 'remainingBal', 'type': 'uint256' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'deposit', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': true, 'stateMutability': 'payable', 'type': 'function' }, { 'inputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }], contractAddress);

      //we use eth_accounts because it returns a list of addresses owned by us.
      accounts  = await ethereum.request({ method: 'eth_accounts' });
      //We take the first address in the array of addresses and display it
      getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
      document.getElementById("claim-addr-input").value = accounts[0];
      search_address_and_update(accounts[0]);
      getNetworkAndChainId()

      ethereum.on('chainChanged', handleNewChain)
      ethereum.on('networkChanged', handleNewNetwork)
      ethereum.on('accountsChanged', handleNewAccounts)


      try {
              // check if the chain to connect to is installed
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
              });
            } catch (error) {
              // This error code indicates that the chain has not been added to MetaMask
              // if it is not, then install it into the user MetaMask
              if (error.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x61',
                        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                      },
                    ],
                  });
                } catch (addError) {
                  console.error(addError);
                }
              }
              console.error(error);
            }



      var decoded_avatar = decode_addr(accounts[0]);
      if(decoded_avatar[0]>0)
          mergeImages(['/img/body_'+decoded_avatar[0]+'.png', '/img/fur_'+decoded_avatar[1]+'.png', '/img/eyes_'+decoded_avatar[2]+'.png', '/img/mouth_'+decoded_avatar[3]+'.png', '/img/accessorie_'+decoded_avatar[4]+'.png'], {  width: 256, height: 256}) .then(b64 => document.querySelector('#avatar').src = b64);


      var isContract = await web3.eth.getCode(contractAddress);
      if (isContract == "0x"){
        throw "Address " + contractAddress + " is not a contract on your network, please check the network config on Metamask and makesure it's Binace Smat Chain TestNet";
        claimButton.disabled = true;
      }/*
      else {
        ;
        //claimButton.disabled = false;

      }
      */
    } catch (error) {
      console.error(error);
      alert(error);
    }

  };
/*
    //Eth_Accounts-getAccountsButton
  getAccountsButton.addEventListener('click', async () => {
    //we use eth_accounts because it returns a list of addresses owned by us.
    accounts  = await ethereum.request({ method: 'eth_accounts' });
    //We take the first address in the array of addresses and display it
    getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
  });
*/


  MetaMaskClientCheck();

  function handleNewAccounts (newAccounts) {
    accounts = newAccounts;
    getAccountsResult.innerHTML = accounts[0];
    document.getElementById("claim-addr-input").value = accounts[0];
    var decoded_avatar = decode_addr(accounts[0]);
    search_address_and_update(accounts[0]);
    if(decoded_avatar[0]>0)
        mergeImages(['/img/body_'+decoded_avatar[0]+'.png', '/img/fur_'+decoded_avatar[1]+'.png', '/img/eyes_'+decoded_avatar[2]+'.png', '/img/mouth_'+decoded_avatar[3]+'.png', '/img/accessorie_'+decoded_avatar[4]+'.png'], {  width: 256, height: 256}) .then(b64 => document.querySelector('#avatar').src = b64);

  }

  async function  handleNewChain  (chainId) {
    chainIdDiv.innerHTML = chainId
    try{
      var isContract = await web3.eth.getCode(contractAddress);
      if (isContract == "0x"){
        throw "Address " + contractAddress + " is not a contract on your network, please check the network config on Metamask and make sure it is Binance Smat Chain TestNet";
        claimButton.disabled = true;
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  function handleNewNetwork (networkId) {
    networkDiv.innerHTML = networkId
  }

  async function getNetworkAndChainId () {
    try {
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      })
      handleNewChain(chainId)

      const networkId = await ethereum.request({
        method: 'net_version',
      })
      handleNewNetwork(networkId)
    } catch (err) {
      console.error(err)
    }
  }



  claimButton.onclick = () => {
    contractStatus.innerHTML = 'Claim initiated for ' + claim_acc_final;
    //deposit no argument
    //from accounts[0]
    //token.makeSnapshot
    contract.methods.makeSnapshot( tx_data).send(
          {
            from: accounts[0],
          }).on('transactionHash', function(hash){
              console.log("txhash ", hash)
              contractStatus.innerHTML = "Check Transaction Hash : <a target=\"_blank\" href=\"https://testnet.bscscan.com/tx/"+hash+"\" >" + "https://testnet.bscscan.com/tx/"+hash + " </a> <br> Check your NUKO balance at the token tracker at the beginning of this page "
            })
            .on('receipt', function(receipt){
                console.log("Receipt ", receipt)
            })
            .on('error', function(error, receipt) {
                console.log("Error ", error)
                alert (error);
            });
          }

}
window.addEventListener('DOMContentLoaded', initialize)
