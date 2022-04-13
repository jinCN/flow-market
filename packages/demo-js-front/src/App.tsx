import React, {useCallback, useEffect} from "react";
import "./App.css";
import {
    fcl,
    FlowEnv,
    MatrixMarketplaceNFTClient
} from "@white-matrix/matrix-marketplace-nft-sdk"
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



    const mint = useCallback(async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        let arg : Array<{[key:string]:string}> = [{sfg:"123"}]
        ret = await client.mintNFTs(["0x9a3bdd00396c6458"], ["1231as"], arg as any);
        console.log(ret);
    },[]);

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
