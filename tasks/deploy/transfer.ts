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
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

const MockClientType = "mock-client"
const PortTransfer = "transfer"
task("transfer:IBC")
  .setAction(async function (taskArguments: TaskArguments, {ethers}) {
    const port = "transfer";
    const channel = "channel-0";

    const signers: SignerWithAddress[] = await ethers.getSigners();
    const alice=signers[1];
    const bob=signers[2];
    const miniTokenAddress = "0xaa43d337145E8930d01cb4E60Abf6595C692921E"
    const miniToken: MiniToken = <MiniToken>await ethers.getContractAt("MiniToken", miniTokenAddress)
    await miniToken.mint(alice.address, 100)
    await miniToken.connect(alice).sendTransfer(4, bob.address, port, channel, 0)
    console.log(`sending 100 tokens to ${bob.address} from besu`)
  });
