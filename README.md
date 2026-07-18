# Task API

Simple to-do list API I built for the FlyRank Week 2 backend assignment. 
Supports create, read, update, and delete for tasks. Data is stored in memory, 
so it resets every time you restart the server (no database yet, that's next week).

## Running it

```bash
npm install
node index.js
```

Server runs at http://localhost:3000

## Endpoints

| Method | Path | What it does |
|--------|------|---------------|
| GET | / | basic info about the API |
| GET | /health | just returns { "status": "ok" } |
| GET | /tasks | list all tasks |
| GET | /tasks/:id | get one task, 404 if it doesn't exist |
| POST | /tasks | create a task, needs a "title" |
| PUT | /tasks/:id | update a task |
| DELETE | /tasks/:id | delete a task |

## Swagger docs

Once the server's running, go to http://localhost:3000/docs to test everything 
in the browser instead of using curl.

## Example

Creating a task:

\`\`\`
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
\`\`\`

Returns a 201 with the new task.