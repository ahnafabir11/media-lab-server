const express = require('express')
const cors = require('cors')

const app = express()
const port = 5000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello hhh!')
})

app.listen(port)