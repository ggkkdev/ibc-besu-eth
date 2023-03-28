import {task} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";

import {
  IBCClient__factory,
  IBCHandler__factory,
  IBCHost__factory,
  IBCIdentifier__factory,
  MiniToken,
  MiniToken__factory
} from "../../types";
import {ContractFactory} from "ethers";

const MockClientType = "mock-client"
const PortTransfer = "transfer"
task("deploy:IBC")
  .setAction(async function (taskArguments: TaskArguments, {ethers}) {
    //const signers: SignerWithAddress[] = await ethers.getSigners();
    const ibcClientFactory: IBCClient__factory = <IBCClient__factory>await ethers.getContractFactory("IBCClient");
    const ibcClient = await ibcClientFactory.deploy()
    const ibcConnectionFactory: ContractFactory = <ContractFactory>await ethers.getContractFactory("IBCConnection", {libraries: {IBCClient: ibcClient.address}});
    const ibcConnection = await ibcConnectionFactory.deploy()
    const ibcChannelFactory: ContractFactory = <ContractFactory>await ethers.getContractFactory("IBCChannel", {
      libraries: {
        IBCClient: ibcClient.address,
        IBCConnection: ibcConnection.address
      }
    });
    const ibcChannel = await ibcChannelFactory.deploy()

    const ibcIdentifierFactory: IBCIdentifier__factory = <IBCIdentifier__factory>await ethers.getContractFactory("IBCIdentifier");
    const ibcIdentifier = await ibcIdentifierFactory.deploy()

    const ibcHostFactory: IBCHost__factory = <IBCHost__factory>await ethers.getContractFactory("IBCHost", {libraries: {IBCIdentifier: ibcIdentifier.address}});
    const ibcHost = await ibcHostFactory.deploy()

    const ibcHandlerFactory: IBCHandler__factory = <IBCHandler__factory>await ethers.getContractFactory("IBCHandler", {
      libraries: {
        IBCChannel: ibcChannel.address,
        IBCClient: ibcClient.address,
        IBCConnection: ibcConnection.address,
        IBCIdentifier: ibcIdentifier.address
      }
    });
    const ibcHandler = await ibcHandlerFactory.deploy(ibcHost.address)

    const mockClientFactory: ContractFactory = <ContractFactory>await ethers.getContractFactory("MockClient");
    const mockClient = await mockClientFactory.deploy()
    const miniTokenFactory: MiniToken__factory = <MiniToken__factory>await ethers.getContractFactory("MiniToken");
    const miniToken: MiniToken = <MiniToken>await miniTokenFactory.deploy(ibcHost.address, ibcHandler.address);

    for (let val of [ibcHost, ibcHandler, miniToken]) {
      console.log(val.address); // prints values: 10, 20, 30, 40
    }
    await ibcHost.setIBCModule(ibcHandler.address)
    await ibcHandler.bindPort(PortTransfer, miniToken.address)
    await ibcHandler.registerClient(MockClientType, mockClient.address)
  });
