import { Provider } from "@ethersproject/providers";
/* eslint-disable camelcase */

import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, BigNumberish } from "ethers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";

// example of contract import
import { Lock } from "./../typechain-types/Lock";

// ----------------------------------------------------------------------------
// OPTIONAL: Constants and Helper Functions
// ----------------------------------------------------------------------------
const SECONDS_IN_DAY: number = 60 * 60 * 24;
const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");

// Bump the timestamp by a specific amount of seconds
const timeTravel = async (seconds: number): Promise<number> => {
  return time.increase(seconds);
};

// Or, set the time to be a specific amount (in seconds past epoch time)
const timeTravelTo = async (seconds: number): Promise<void> => {
  return time.increaseTo(seconds);
};

// Compare two BigNumbers that are close to one another.
//
// This is useful for when you want to compare the balance of an address after
// it executes a transaction, and you don't want to worry about accounting for
// balances changes due to paying for gas a.k.a. transaction fees.
const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};
// ----------------------------------------------------------------------------
/**
 pause automine
 await network.provider.send("evm_setAutomine", [false]);
 unpause automine
 await network.provider.send("evm_setAutomine", [true]);
 
 await network.provider.send("evm_mine");
 */

describe("CollectorDao", () => {
  // See the Hardhat docs on fixture for why we're using them:
  // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures

  // In particular, they allow you to run your tests in parallel using
  // `npx hardhat test --parallel` without the error-prone side-effects
  // that come from using mocha's `beforeEach`
  async function setupFixture() {
    const { provider } = ethers;
    const [
      deployer,
      alice,
      bob,
      tom,
      kate,
      ...otherSigners
    ]: SignerWithAddress[] = await ethers.getSigners();

    const tenAccounts = otherSigners.slice(0, 10);

    const LockFactory = await ethers.getContractFactory("Lock");
    const lock: Lock = (await LockFactory.deploy()) as Lock;
    await lock.deployed();

    console.log("Contract Address", lock.address);

    return {
      lock,
      deployer,
      provider,
      alice,
      bob,
      tom,
      kate,
      tenAccounts,
    };
  }

  describe("Deployment & Test Setup", () => {
    let ctx: {
      lock: Lock;
      deployer: SignerWithAddress;
      alice: SignerWithAddress;
      bob: SignerWithAddress;
      tom: SignerWithAddress;
      kate: SignerWithAddress;
      provider: Provider;
      tenAccounts: SignerWithAddress[];
    };

    beforeEach(async () => {
      ctx = await loadFixture(setupFixture);
      // await network.provider.send("evm_setAutomine", [true]);
    });

    it("Flags floating promises", async () => {
      // NOTE: This test is just for demonstrating/confirming that eslint is
      // set up to warn about floating promises.
      const { lock } = await loadFixture(setupFixture);
      // const txReceiptUnresolved = await lock.connect(alice).enroll({
      //   value: parseEther("1"),
      // });
      expect(txReceiptUnresolved.wait()).to.be.reverted;
    });

    it("deploys mock marketplace contract", async () => {
      const { lock } = ctx;
      expect(lock.address).to.be.ok;
    });
  });
});
