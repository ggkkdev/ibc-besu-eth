import {task} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";

import {MiniToken} from "../../types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

task("check:IBC")
  .setAction(async function (taskArguments: TaskArguments, {ethers}) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const bob = signers[2];
    const miniTokenAddress = "0xaa43d337145E8930d01cb4E60Abf6595C692921E"
    const miniToken: MiniToken = <MiniToken>await ethers.getContractAt("MiniToken", miniTokenAddress)
    const balance = await miniToken.balanceOf(bob.address)
    console.log(` bob ${signers[2].address} `)
    console.log(`Bob has now ${balance} tokens in ethereum`)
  });
