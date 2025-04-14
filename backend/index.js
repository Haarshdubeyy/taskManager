

const express = require('express')

const app = express();
require('dotenv').config()
require('./Models/db')


const PORT = process.env.PORT || 5000

const TaskRouter = require('./Routes/TaskRouter.js');
const bodyParser = require('body-parser');

app.listen(PORT,() => {
    console.log(`Server is running at https://localhost:${PORT}`)
});



app.get('/',(req,res) => {
    res.send('Hello world')
});


app.use(bodyParser.json());
app.use('/tasks',TaskRouter)


app.get('/api',(req,res) => {
    res.json({message:'Hello from the server!'})
}
)

