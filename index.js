const express = require('express');
const Database = require('better-sqlite3');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const db = new Database('tasks.db');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.exec(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
    )`)
const count = db.prepare('SELECT COUNT(*) As total FROM tasks').get().total;
if(count === 0){
    db.exec(`INSERT INTO tasks(title,done) VALUES ('Ajdin',0),('Dzejlan',0 ),('Medin',0)`)
    console.log("First three tasks added");
}

app.get('/',(req,res)=>{
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
})
app.get('/health',(req,res) => {
    res.json({"status" : "ok"})
})
app.get('/tasks',(req,res) => {
    const tasksDb = db.prepare('SELECT * FROM tasks').all();
    res.json(tasksDb);
})
app.get('/tasks/:id',(req,res) => {
    const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(req.params.id);
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
app.put('/tasks/:id',(req,res) => {
    const task = tasks.find(i => i.id == req.params.id)
    if(!task){
        return res.status(404).json({"error" : `Task ${req.params.id} not found`});
    }
    const titleUpdate = req.body.title;
    if(!titleUpdate || titleUpdate.trim() == ""){
        return res.status(400).json({ "error": "title is required" })
    }
    task.title = titleUpdate;
    task.done = req.body.done !== undefined ? req.body.done : task.done;
    res.status(200).json(task);

})
app.delete('/tasks/:id',(req,res)=>{
    const taskIndex = tasks.findIndex(i => i.id == req.params.id)
    if(taskIndex === -1){
        return res.status(404).json({"error" : `Task ${req.params.id} not found`});
    }
    tasks.splice(taskIndex,1);
    res.status(204).send();
})

app.listen(port, () => console.log(`its alive on http://localhost:${port}`));

