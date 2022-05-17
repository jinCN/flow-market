import React, {useCallback, useEffect} from "react";
import "./App.css";
import {
    fcl,
    FlowEnv,
    MatrixMarketClient,
    MatrixMarketOpenBidClient
} from "@matrix-labs/matrix-marketplace-nft-sdk"
const openBidClient = new MatrixMarketOpenBidClient();
const nftClient = new MatrixMarketClient();

const network = process.env.REACT_APP_NETWORK;
function App() {

    const check = useCallback(async () => {
        await fcl.currentUser.unauthenticate()
        console.log(`checking.....${network}`)
        if(network === 'test') {
            console.log('checking test....')
            await nftClient.bindFcl(fcl, FlowEnv.flowTestnet);
            await openBidClient.bindFcl(fcl, FlowEnv.flowTestnet);
            await fcl.logIn();
            await fcl.authenticate();
        } else if (network === 'local'){
            console.log('checking local....')
            await nftClient.bindFcl(fcl, FlowEnv.localEmulator);
            await openBidClient.bindFcl(fcl, FlowEnv.localEmulator);
            await fcl.logIn();
            await fcl.authenticate();
        }

    },[]);

    useEffect(() => {
        check();
    },[check])



    const mint = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await nftClient.mintNFTs('0x7f3812b53dd4de20',[user.addr], ["1231as"],  [{key:"version",value:"1.0.0"}]).catch(console.error);
        console.log(ret);
    };


    const checkNFTsCollection = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        //ret = await nftClient.checkNFTsCollection("0x445697f20309b7c0");
        ret = await nftClient.checkNFTsCollection(user.addr);
        console.log(ret);
    };

    const getNFTs = async () => {

        let ret;

        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await nftClient.getNFTs(user.addr);
        console.log(ret);
    };

    const initNFTCollection = async () => {

        let ret;
        ret = await nftClient.initNFTCollection();
        console.log(ret);
    };

    const initOpenBid = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.initOpenBid().catch(console.error);
        console.log(ret);
    };

    const openBid = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.openBid(19, '2.58' ).catch(console.error);
        console.log(ret);
    };

    const removeOpenBid = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.removeBid(90575769 ).catch(console.error);
        console.log(ret);
    };

    const acceptBid = async () => {
        let ret;
        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.acceptBid(90576137, '0xae8b87df71d454cb' ).catch(console.error);
        console.log(ret);
    };

    const getBidDetails = async () => {

        let ret;

        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.getBidDetails("0xae8b87df71d454cb", 90576137);
        console.log(ret);
    };

    const getBidIds = async () => {

        let ret;

        const user = await fcl.currentUser().snapshot();
        console.log(user);
        ret = await openBidClient.getBidIds(user.addr);
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

        <button onClick={initOpenBid} className="App-link">
            initOpenBid
        </button>
        <button onClick={openBid} className="App-link">
            openBid
        </button>
        <button onClick={removeOpenBid} className="App-link">
            removeOpenBid
        </button>
        <button onClick={acceptBid} className="App-link">
            acceptBid
        </button>
        <button onClick={getBidDetails} className="App-link">
            getBidDetails
        </button>
        <button onClick={getBidIds} className="App-link">
            getBidIds
        </button>
    </div>
  );
}

export default App;
