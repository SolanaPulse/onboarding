import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Onboarding } from "../target/types/onboarding";
import { expect } from "chai";

describe("onboarding", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();
  const program = anchor.workspace.onboarding as Program<Onboarding>;

  let user;
  let userPda;

  before(async () => {
    user = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array([
        113, 11, 74, 1, 217, 150, 61, 24, 255, 96, 212, 17, 132, 89, 95, 156,
        206, 184, 115, 112, 149, 134, 117, 205, 195, 177, 250, 241, 37, 29, 200,
        3, 154, 200, 1, 29, 85, 74, 218, 6, 95, 50, 145, 122, 118, 85, 145, 171,
        86, 12, 188, 177, 47, 59, 249, 59, 249, 22, 70, 172, 10, 106, 1, 225,
      ])
    );
    userPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.publicKey.toBuffer()],
      program.programId
    )[0];

    // const airdropSig = await provider.connection.requestAirdrop(
    //   user.publicKey,
    //   2_000_000_000 //2 sols
    // );

    // await provider.connection.confirmTransaction(airdropSig, "confirmed");
  });

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${provider.connection.rpcEndpoint}`
    );
    return signature;
  };

  it("Should check the user is not registerd before", async () => {
    try {
      await program.account.user.fetch(userPda);
      throw new Error("user account should not exist");
    } catch (error) {
      expect(error.message).to.include("Account does not exist");
    }
  });

  it("Should register user", async () => {
    const tx = await program.methods
      .registerUser()
      .accountsPartial({
        user: user.publicKey,
        userAccount: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const userAccount = await program.account.user.fetch(userPda);

    expect(userAccount.user.toBase58()).to.be.equal(user.publicKey.toBase58());
    expect(userAccount.bump).to.be.a("number");
    log(tx);
  });

  it("Should fail to register user as user already exists", async () => {
    try {
      await program.methods
        .registerUser()
        .accountsPartial({
          user: user.publicKey,
          userAccount: userPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (e) {
      expect(e.message).to.include("already in use");
    }
  });

  it("Should delete user", async () => {
    const initialUserBalance = await provider.connection.getBalance(
      user.publicKey
    );

    const tx = await program.methods
      .deleteUser()
      .accountsPartial({
        user: user.publicKey,
        userAccount: userPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    try {
      await program.account.user.fetch(userPda);
      throw new Error("user account should be closed");
    } catch (error) {
      expect(error.message).to.include("Account does not exist");
    }

    const currentBalance = await provider.connection.getBalance(user.publicKey);

    expect(currentBalance).to.be.greaterThan(initialUserBalance);
    log(tx);
  });

  it("Should fail to  delete user that does not exist", async () => {
    try {
      await program.methods
        .deleteUser()
        .accountsPartial({
          user: user.publicKey,
          userAccount: userPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (e) {
      expect(e.message).to.include("AccountNotInitialized.");
    }
  });
});
