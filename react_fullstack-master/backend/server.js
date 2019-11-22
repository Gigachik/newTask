const mongoose = require("mongoose");
const getSecret = require("./secret");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");



const API_PORT = 3001;
const app = express();
const router = express.Router();


const cors = require('cors');
app.use(cors());
app.options('*', cors());


mongoose.connect(getSecret("dbUri"));
let db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/", (req, res) => {
  res.json({ message: "HELLOW WORLDUUHHHH" });
});

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/updateData", (req, res) => {
  //Возможно нужно создать массив в кот. будут лежать id, update
  //и возвращать этот массив через res
  const { id, update } = req.body;

  Data.findOneAndUpdate({id}, update, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ data });
  });
});

router.delete("/deleteData", (req, res) => {
  console.log("DELETE DATA");

  const  {id}  = req.body;
  console.log('ID', id)
  Data.findOneAndRemove( {id} , err => {
    if (err) return res.send(err);
    return res.json({ id });
  });
});

router.post("/putData", (req, res) => {
  console.log("PUT DATA");
  res.header("Access-Control-Allow-Origin", "*");
  
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save((err, data) => {
    if (err) return res.status(500).json({ success: false, error: err });
    return res.json({data});
  });
});


app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON UHH PORT ${API_PORT}`));
