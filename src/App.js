import logo from './logo.svg';
import './App.css';
//const {token} = require('./config/config.json')
//const discord = require('discord.js')
//const client = new discord.Client()
const ethers = require('ethers')

//client.login(token)

  


function App() {

  const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (!accessToken) {
      alert("Error, Please return to the server and re-join")
      return
    }

  async function connectWallet() {

    try {

        const { ethereum } = window
        const signer = new ethers.providers.Web3Provider(ethereum, 'any').getSigner()
        const Address = (await ethereum.request({ method: "eth_requestAccounts" }))[0]
        const user = await fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${tokenType} ${accessToken}`,
          },
        }).then(result => result.json()).catch(console.error)

        if (!ethereum) {
          alert("Get MetaMask!")
          return
        } 

        //Switch to Rinekby
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
          });
          
        } catch (switchError) {
          // If Chain Not in Metamask (error 4902)
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ chainId: '0x4', chainName: 'rinkeby', rpcUrls: ['https://rinkeby-light.eth.linkpool.io/'] }],
              });
            } catch (error) {
              console.log(error)
            }
          }
          
        }
        
        document.getElementById("output").innerHTML = `Linked Discord ID ${user.id} (TODO: Have Username Here) to Wallet Address ${Address}`
        
    
    } catch (error) {
        console.log(error)
    }
      
  }

  return (
    <div className="App">

      <h3>Tavern Keeper Authentication</h3>
      <button onClick= {connectWallet} id='button'>Authenticate</button>
      <p id="output"></p>

    </div>
  );
}

export default App;
