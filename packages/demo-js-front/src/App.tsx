import React, {useCallback, useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  fcl,
  StorefrontClient,
  FlowEnv,
} from "@white-matrix/matrix-flow-market-sdk/dist";

const client = new StorefrontClient();
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



    const transfer = useCallback(async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);

        // check assets (mainnet)
        ret = await client.getNFTs("0xa2811f685dccc3ec");
        console.log(ret);

        // ret = await client.purchaseList(35, "0xed2a0254c4130116");
        // console.log(ret);

        ret = await client.getNFTs("0xa2811f685dccc3ec");
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
        ret = await client.getNFTs("0xa56c5e5fd9b9ca22");
        console.log(ret);
        // ret = await client.getNFTs("0x7f3812b53dd4de20");
        // console.log(ret);
        // ret = await client.getNFTs("0x9a3bdd00396c6458");
        // console.log(ret);
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await client.getNFTs(user.addr);
        console.log(ret);
    };

    const initStorefront = async () => {

        let ret;
        ret = await client.initStorefront();
        console.log(ret);
    };

    const initNFTCollection = async () => {

        let ret;
        ret = await client.initNFTCollection();
        console.log(ret);
    };

    const createList = async () => {

        let ret;
        ret = await client.createList(3, "2.0");
        console.log(ret);
    };

    const purchaseList = async () => {

        let ret;
        ret = await client.purchaseList(43240166, "0xeddb249e99d82047");
        console.log(ret);
    };

    const removeList = async () => {

        let ret;
        ret = await client.removeList(43234808);
        console.log(ret);
    };
    // ret = await client.initAssetsCollection();
    // console.log(ret);

    // ret = await client.checkVoucherCollection(user.addr);
    // console.log(ret);
    //
    // ret = await client.initVoucherCollection();
    // console.log(ret);

    // ret = await client.transferVoucher("0x01cf0e2f2f715450", 0);
    // console.log(ret);


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
      <button onClick={initStorefront} className="App-link">
          initStorefront
      </button>
      <button onClick={createList} className="App-link">
          createList
      </button>
      <button onClick={purchaseList} className="App-link">
          purchaseList
      </button>
      <button onClick={removeList} className="App-link">
          removeList
      </button>
    </div>
  );
}

export default App;
