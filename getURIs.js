const ethers = require('ethers');
const fs = require('fs');

async function getURIs() {
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
  
  // ERC721URIStorage ABI 
  const abi = [
    "function uri(uint256) view returns (string)",
    "function tokenURI(uint256) view returns (string)",
    "function exists(uint256) view returns (bool)"
  ];
  
  const contract = new ethers.Contract('0x931204fb8cea7f7068995dce924f0d76d571df99', abi, provider);
  
  const uris = [];
  for(let i = 1; i <= 201; i++) {
    try {
      // Try uri() first, then tokenURI()
      let uri;
      try {
        uri = await contract.uri(i);
      } catch {
        uri = await contract.tokenURI(i);
      }
      
      uris.push({
        tokenId: i.toString(),
        contractAddress: contract.address,
        uri
      });
      console.log(`Got URI for token ${i}: ${uri}`);
    } catch (e) {
      console.error(`Failed token ${i}:`, e.message);
    }
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  fs.writeFileSync('nft_index.json', JSON.stringify(uris, null, 2));
}

getURIs().catch(console.error);
