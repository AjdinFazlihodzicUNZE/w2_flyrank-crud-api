const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

tasks = [
    {"id" : 1,"title":"Task1","done":true},
    {"id" : 2,"title":"Task2","done":false},
    {"id" : 3,"title":"Task3","done":false},
]

app.get('/',(req,res)=>{
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
})
app.get('/health',(req,res) => {
    res.json({"status" : "ok"})
})
app.get('/tasks',(req,res) => {
    res.json(tasks);
})
app.get('/tasks/:id',(req,res) => {
    const task = tasks.find(i => i.id == req.params.id)
    if(!task){
        return res.status(404).json({"error" : `Task ${req.params.id} not found`});
    }
    res.json(task);
})
app.post('/tasks',(req,res) => {
    const title = req.body.title;
    if(!title || title.trim() == ""){
        return res.status(400).json({ "error": "title is required" })
    }
    const newTask = {id : tasks.length+1,title: title, done: false };
    tasks.push(newTask);
    res.status(201).json(newTask)

})
app.listen(port, () => console.log(`its alive on http://localhost:${port}`));

