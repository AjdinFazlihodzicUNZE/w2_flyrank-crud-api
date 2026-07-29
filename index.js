const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const { pool, initDb } = require('./db');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initDb().then(() => {
  console.log('Connected to Postgres successfully');
}).catch((err) => {
  console.error('Failed to load Postgres DB:', err);
}); 

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
    const result = db.prepare(`INSERT INTO tasks (title,done) VALUES (?,?)`).run(title,0);
    const newTask = {
    id: result.lastInsertRowid,
    title: title,
    done: 0
    };
    res.status(201).json(newTask)
})
app.put('/tasks/:id',(req,res) => {
   const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(req.params.id);
    if(!task){
        return res.status(404).json({"error" : `Task ${req.params.id} not found`});
    }
    const titleUpdate = req.body.title;
    if(!titleUpdate || titleUpdate.trim() == ""){
        return res.status(400).json({ "error": "title is required" })
    }
    const doneUpdate = req.body.done !== undefined ? req.body.done : task.done;
    db.prepare(`UPDATE tasks SET title = ?,done = ? WHERE id = ?`).run(titleUpdate,doneUpdate ? 1 : 0,req.params.id);
    const updatedTask = {
    id: req.params.id,
    title: titleUpdate,
    done: doneUpdate
    };
    res.status(200).json(updatedTask);

})
app.delete('/tasks/:id',(req,res)=>{
    const taskIndex = db.prepare(`SELECT id FROM tasks WHERE id = ?`).get(req.params.id);
    if(!taskIndex){
        return res.status(404).json({"error" : `Task ${req.params.id} not found`});
    }
    db.prepare(`DELETE FROM tasks WHERE id = ?`).run(req.params.id);
    res.status(204).send();
})

app.listen(port, () => console.log(`its alive on http://localhost:${port}`));

