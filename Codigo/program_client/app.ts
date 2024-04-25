import {addTweetSendAndConfirm, getTweet, initializeClient} from "./index";
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

async function main(feePayer: Keypair) {
  // TODO: Specify the program Id we saved from when we deploy it
  const progId = new PublicKey("9U8FpTpoP6j5uqBURoRUkGY7JLpUmAmALd6KWhMSKaXh");

  // Create a new Solana connection
  const connection = new Connection("https://api.devnet.solana.com ", {
    commitment: "confirmed"
  });

  initializeClient(progId, connection);

  // 0. Create keypair for the Greeting account
  const tweetAccount = Keypair.generate();

  // 1.  Create tweet
  await addTweetSendAndConfirm({
    signers: {
      feePayer,
      tweetAccount
    }
  });
  let account = await getTweet(tweetAccount.publicKey);
  console.info(account);
  console.log(await connection.getAccountInfo(tweetAccount.publicKey));
  console.log(await connection.getAccountInfo(feePayer.publicKey));
  console.log(await connection.getAccountInfo(feePayer.publicKey));

}

fs.readFile(path.join(os.homedir(), ".config/solana/id.json"))
        .then(file => main(Keypair.fromSecretKey(new Uint8Array(JSON.parse(file.toString())))));