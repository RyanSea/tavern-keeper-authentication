import logo from './logo.svg';
import './App.css';
const {privateKey} = require('./config/config.json')
const {abi} = require('./config/ValuDAO.json')
const ethers = require('ethers')


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
        //const signer = new ethers.providers.Web3Provider(ethereum, 'any').getSigner()
        const Address = (await ethereum.request({ method: "eth_requestAccounts" }))[0]

        const meterProvider = new ethers.providers.JsonRpcProvider("https://rpctest.meter.io/");
        const meterSigner = new ethers.Wallet(privateKey, meterProvider);
        const meterValu = new ethers.Contract('0xbeA719cD63915c6FF6679de2DAd5E7286B6bb80b', abi, meterSigner)

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
        // try {
        //   await ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: '0x13881' }],
        //   });
          
        // } catch (switchError) {
        //   // If Chain Not in Metamask (error 4902)
        //   if (switchError.code === 4902) {
        //     try {
        //       await ethereum.request({
        //         method: 'wallet_addEthereumChain',
        //         params: [{ chainId: '0x4', chainName: 'rinkeby', rpcUrls: ['https://rinkeby-light.eth.linkpool.io/'] }],
        //       });
        //     } catch (error) {
        //       console.log(error)
        //     }
        //   }
          
        // }
        meterValu.authenticate('934190608514441237', user.id, Address)
        document.getElementById("output").innerHTML = `Linked ${user.username}#${user.discriminator}'s Discord ID (${user.id}) to Wallet Address ${Address}`
        
    
    } catch (error) {
        console.log(error)
    }
      
  }

  return (
    <div className="App">
      <img src={require('./Authentication.png')}></img>
      <h3 color='white' >Valu Authentication</h3>
      <button onClick= {connectWallet} id='button'>Authenticate</button>
      <p id="output"></p>

    </div>
  );
}

export default App;
