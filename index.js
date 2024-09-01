const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(port,()=>{
    console.log(`App is running from port ${port}`)
})