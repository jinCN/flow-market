import {FlowEnv} from '../env';
import {IBindConfigs} from './NFTClient';

export interface TemplateNFTClient {
  bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void>;
  
  /** Setup FCL instance
   *
   * @async
   * @param {key} - example:"0xNFT_ADDRESS"
   * @param {value} - example:"0x7f3812b53dd4de20"
   * @returns {Promise<void>}
   */
  setupFcl(key: string, value: string): Promise<void>;
  
  bindAuth(flowAddress: string, privateKeyHex: string, accountIndex: number): void;
  
  deploy(NFTName: string): Promise<string>;
  
  mintNFTs(NFTName: string, NFTAddress: string, recipientBatch: string[], subCollectionIdBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string>;
  
  checkNFTsCollection(NFTName: string, NFTAddress: string, address: string): Promise<boolean>;
  
  getNFTs(NFTName: string, NFTAddress: string, account: string): Promise<number[]>;
  
  initNFTCollection(NFTName: string, NFTAddress: string): Promise<string>;
}
