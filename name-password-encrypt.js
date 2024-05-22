const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  console.log("GET /users");
  // res.status(200).json(users);
  res.json(users);
});

app.post("/users/registry", async (req, res) => {
  // 理解 bcrypt
  try {
    //方案1
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log("salt:", salt);

    //方案2
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hashedPassword:", hashedPassword);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    //   res.status(201).json(user);
    res.status(201).send("User Created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(5050, () => {
  console.log("server is on 5050");
});
