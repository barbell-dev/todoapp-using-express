const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
let log = console.log;
app.get("/", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      let todos = [];
      fs.writeFile("todos.json", JSON.stringify(todos), () => {
        res.json({ todoList: todos, msg: "Todo list is empty." });
      });
    } else {
      res.json({ data });
    }
  });
});
//todos.json structure.
/*
    [{id:1,todos:[{todoID:1,todo:"kek"},{todoID:2,todo:"kek2"}]},{id:2,todos:[{todoID:1}...]}]
*/
app.post("/", function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const todo = req.body.todo;
  console.log("here");
  // fs.writeFile("todos.json","utf")
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      let temp = {};
      let data = [];
      temp.id = id;
      temp.todos = [];
      let smallerObject = {};
      smallerObject.todoID = 1;
      smallerObject.todo = todo;
      temp.todos.push(smallerObject);
      data.push(temp);
      fs.writeFile("todos.json", JSON.stringify(data), () => {
        res.json({ statuscode: 200, msg: `Todo ${todo} has been added.` });
      });
    } else {
      if (data == "[]") {
        // log(data);
        let data = [];
        let temp = {};
        temp.id = id;
        temp.todos = [];
        let smallerObject = {};
        smallerObject.todoID = 1;
        smallerObject.todo = todo;
        temp.todos.push(smallerObject);
        data.push(temp);
        fs.writeFile("todos.json", JSON.stringify(data), () => {
          res.json({ statuscode: 200, msg: `Todo ${todo} has been added.` });
        });
      } else {
        let temp = JSON.parse(data);
        let found = 0;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id == id) {
            const todoID = temp[i].todos.length + 1;
            const todoToBeAdded = todo;
            const smallerObject = {
              todoID: todoID,
              todoToBeAdded: todoToBeAdded,
            };
            temp[i].todos.push(smallerObject);
            let data = temp;
            fs.writeFile("todos.json", JSON.stringify(data), () => {
              res.json({
                statuscode: 200,
                msg: `Todo ${todo} has been added.`,
              });
            });
            found = 1;
            break;
          }
        }
        if (found == 0) {
          let dataTemp = JSON.parse(data);
          let temp = {};
          temp.id = id;
          temp.todos = [];
          let smallerObject = {};
          smallerObject.todoID = 1;
          smallerObject.todo = todo;
          temp.todos.push(smallerObject);
          dataTemp.push(temp);
          fs.writeFile("todos.json", JSON.stringify(dataTemp), () => {
            res.json({ statuscode: 200, msg: `Todo ${todo} has been added.` });
          });
        }
      }
    }
  });
});
app.listen(3000);
