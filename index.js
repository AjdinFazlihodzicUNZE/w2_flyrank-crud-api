const app = require('express')();
const port = 3000;


app.get('/',(req,res)=>{
    res.send('Hello world');
})
app.listen(port, () => console.log(`its alive on http://localhost:${port}`));