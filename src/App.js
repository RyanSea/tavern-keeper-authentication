import logo from './logo.svg';
import './App.css';
const {privateKey, polygon, rinkeby} = require('./config/config.json')
const {abi} = require('./config/ValuDAO.json')
const ethers = require('ethers')


function App() {

  const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType, server_id] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

    if (!accessToken) {
      alert("Error, Please return to the server and re-join")
      return
    }

  async function connectWallet() {

    try {

          const { ethereum } = window
          //const signer = new ethers.providers.Web3Provider(ethereum, 'any').getSigner()
          const Address = (await ethereum.request({ method: "eth_requestAccounts" }))[0]

          const provider = new ethers.providers.WebSocketProvider(rinkeby);
          const signer = new ethers.Wallet(privateKey, provider);
          const valu = new ethers.Contract('0xABF71fbfB4cFbc0649fFbb55505797BcAFDDFD1c', abi, signer)

          const user = await fetch('https://discord.com/api/users/@me', {
            headers: {
              authorization: `${tokenType} ${accessToken}`,
            },
          }).then(result => result.json()).catch(console.error)

          if (!ethereum) {
            alert("Get MetaMask!")
            return
          } 

        //Switch to Mumbai
        // try {
        //   await ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: '0x13881' }],
        //   });
          
        // } catch (switchError) {
          // If Chain Not in Metamask (error 4902)
          // if (switchError.code === 4902) {
          //   try {
          //     await ethereum.request({
          //       method: 'wallet_addEthereumChain',
          //       params: [{ chainId: '0x13881', chainName: 'Polygon Mumbai', rpcUrls: [polygon] }],
          //     });
          //   } catch (error) {
          //     console.log(error)
          //   }
          // }
          
        // }
        console.log(server_id)
        console.log(user.id)
        console.log(Address)
        await valu.authenticate(server_id, user.id, Address)
        console.log('done!')
        document.getElementById("button").innerHTML = `Authentication Successful!`
        
    
    } catch (error) {
        console.log(error)
    }
      
  }

  return (
    <div className="App">
      <img src={require('./Authentication.png')}></img>
      <h3 color='white' >Valu Authentication</h3>
      <button onClick= {connectWallet} id='button'>Authenticate</button>
      <p color="white" id="output"></p>

    </div>
  );
}

export default App;
