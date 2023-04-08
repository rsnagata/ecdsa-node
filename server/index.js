const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { verifyPublicKey } = require("./cryptography");

app.use(cors());
app.use(express.json());

//Private Key: 8716a29b8c1012b7946a5babd99ae63f6d87dfa57227eca217d33979843e0e99
//Public Key: 897ad9f4218a776e9cd5da6e022eec6e52f888f0

//Private Key: 0d1ceba977ac84bd9fd446f932fe358b44aa63b9ecbf43f9b7f1b734aecf5dd8
//Public Key: 98a21f632d25133e29f0b8053e11d84922827fb9

//Private Key: 99de4018fbbb5ed9847085427e6f4fe34a66354ee8cc0150738df6f14e777184
//Public Key: 7b66bb4374b8af05712465da2169ce0f7cb87f43

const balances = {
  "897ad9f4218a776e9cd5da6e022eec6e52f888f0": 100, //My Public KEY
  "98a21f632d25133e29f0b8053e11d84922827fb9": 50,
  "7b66bb4374b8af05712465da2169ce0f7cb87f43": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, senderPK } = req.body;

  //sender = "897ad9f4218a776e9cd5da6e022eec6e52f888f0";
  //console.log(sender)
  //senderPrivate = "8716a29b8c1012b7946a5babd99ae63f6d87dfa57227eca217d33979843e0e99";

  setInitialBalance(sender);
  setInitialBalance(recipient);

  verifyPublicKey(sender, senderPK).then((isValid) => {
    if (!isValid) {
      res.status(403).send({ message: "You cannot send funds!" });
    } else if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }

  })

  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
