const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
let log = console.log;
app.get("/", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err || data.trim() == "") {
      let todos = [];
      fs.writeFile("todos.json", JSON.stringify(todos), () => {
        res.json({ todoList: todos, msg: "Todo list is empty." });
      });
    } else {
      log(data);
      res.json({ data: JSON.parse(data) });
    }
  });
});
//todos.json structure.
/*
    [{id:1,todos:[{todoID:1,todo:"kek"},{todoID:2,todo:"kek2"}]},{id:2,todos:[{todoID:1}...]}]
*/
app.put("/", function (req, res) {
  fs.readFile("todos.json", "utf-8", function (err, data) {
    if (err) {
      res.json({ message: "File not found." });
      return;
    } else {
      const id = req.body.id;
      const oldTodo = req.body.oldTodo;
      const newTodo = req.body.newTodo;
      const jsonData = JSON.parse(data);
      let FOUND = 0;
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == id) {
          let todoList = jsonData[i].todos;
          let found = 0;
          for (let j = 0; j < todoList.length; j++) {
            if (todoList[j].todo == oldTodo) {
              todoList[j].todo = newTodo;
              jsonData[i].todos = todoList;
              fs.writeFile("todos.json", JSON.stringify(jsonData), () => {
                res.json({ message: "Done" });
              });
              found = 1;
              FOUND = 1;
            }
          }
          if (found == 0) {
            FOUND = 1;
            res.json({ message: "Todo not found for that ID." });
            break;
          }
        }
      }
      if (FOUND == 0) {
        res.json({ message: "ID not found." });
      }
    }
  });
});
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
              todo: todoToBeAdded,
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
app.delete("/", function (req, res) {
  const id = req.body.id;
  const todo = req.body.todo;
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err || data == "[]" || data.trim() == "") {
      res.json({ msg: "File not found or file is empty. Cannot delete" });
      return;
    } else {
      let jsonData = JSON.parse(data);
      let FOUND = 0;
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == id) {
          // log("here");
          let found = 0;
          let todoList = jsonData[i].todos;
          // if(todoList)
          for (let j = 0; j < todoList.length; j++) {
            if (todoList[j].todo == todo) {
              todoList.splice(j, 1);
              jsonData[i].todos = todoList;
              fs.writeFile("todos.json", JSON.stringify(jsonData), () => {
                res.send("Deleted.");
              });
              found = 1;
              FOUND = 1;
              break;
            }
          }
          if (found == 0) {
            FOUND = 1;
            res.send("Couldnt find todo for that ID.");
            break;
          }
        }
      }
      if (FOUND == 0) {
        res.send("Couldnt find ID");
        return;
      }
    }
  });
});
app.listen(3000, () => {
  log("Listening on 3000");
});
