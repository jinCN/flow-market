import React, {useCallback, useEffect} from "react";
import "./App.css";
import {
    fcl,
    FlowEnv,
    MatrixMarketplaceNFTClient
} from "@matrix-labs/matrix-marketplace-nft-sdk"
const client = new MatrixMarketplaceNFTClient();
function App() {

    const check = useCallback(async () => {
        // await client.setupGlobalFcl(FlowEnv.localEmulator);
        // await client.setupGlobalFcl(FlowEnv.flowMainnet);
        await client.setupGlobalFcl(FlowEnv.flowTestnet);
        await fcl.logIn();
        await fcl.authenticate();
    },[]);

    useEffect(() => {
      check();
    },[check])



    const mint = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await client.mintNFTs('0x7f3812b53dd4de20',[user.addr], ["1231as"],  [{key:"version",value:"1.0.0"}]).catch(console.error);
        console.log(ret);
    };


    const checkNFTsCollection = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        //ret = await client.checkNFTsCollection("0x445697f20309b7c0");
        ret = await client.checkNFTsCollection(user.addr);
        console.log(ret);
    };

    const getNFTs = async () => {

        let ret;

        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await client.getNFTs(user.addr);
        console.log(ret);
    };

    const initNFTCollection = async () => {

        let ret;
        ret = await client.initNFTCollection();
        console.log(ret);
    };


  return (
    <div className="App">
      <button onClick={initNFTCollection} className="App-link">
          initNFTCollection
      </button>
      <button onClick={checkNFTsCollection} className="App-link">
          checkNFTsCollection
      </button>
      <button onClick={getNFTs} className="App-link">
          getNFTs
      </button>
        <button onClick={mint} className="App-link">
            mint
        </button>
    </div>
  );
}

export default App;
