const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/todolistDB",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => {
    console.log("DB Connected");
  }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = new mongoose.model("Item", itemsSchema);

const task1 = new Item({
  name: "Go for Walk",
});

const task2 = new Item({
  name: "Go gym",
});

const task3 = new Item({
  name: "Buy Grocery",
});

const defaultItems = [task1, task2, task3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Inserted");
        }
      });
    }
    res.json(foundItems);
  });
});


app.post("/", function (req, res) {
  const itemName = req.body.name;

  const item = new Item({
    name: itemName,
  });

  item.save().then((data) => {
    Item.find({}, function (err, foundItems) {
      res.json(foundItems);
    });
  });
});



app.delete("/delete", function (req, res) {
  const checkedItem = req.body._id;

  Item.findByIdAndRemove(checkedItem,function(err){
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("Successfully deleted");
       Item.find({}, function (err, foundItems) {
         res.json(foundItems);
       });
    }
  })
});




app.put("/update",function(req,res){
  const id = req.body._id; 
  
  Item.findByIdAndUpdate(id, {name: req.body.name}, function(err){
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("Successfully updated");
      Item.find({}, function (err, foundItems) {
        res.json(foundItems);
      });
    }
  })
});




app.listen(4000, function () {
  console.log("Server started on port 4000");
});
