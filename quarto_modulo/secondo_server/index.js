const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const port = 3000

const caseCinematografiche = require("./case_cinematografiche.json")

// devo fornire al server l'informazione dell'id piu' grande
// esistente all'interno di case-cinematografiche.json
// perche' abbiamo bisogno di tenerne traccia per via
// delle POST

// non lo faccio cosi perche' e' "debole" come implementazione
// potrebbe succedere che non c'e' un legame diretto
// tra posizione dell'i-esimo elemento e suo id
// const id = caseCinematografiche[caseCinematografiche.length - 1].id

let NEXT_ID = caseCinematografiche
  .reduce((bigger, c) => c.id > bigger ? c.id : bigger, -1)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/case-cinematografiche', (req, res) => {
  res.send(caseCinematografiche);
})

app.get('/case-cinematografiche/ricerca/:termine', (req, res) => {
  const caseFiltrate = []
  /*
  a partire da un array di oggetti dobbiamo prendere il termine 
  Usiamo un for per ciclare sull'array di oggetti 
  */
  for (let i = 0; i < caseCinematografiche.length; i++) {
    if (caseCinematografiche[i].nome.includes(req.params.termine)) {
      caseFiltrate.push(caseCinematografiche[i])
    }
  }
  res.send(caseFiltrate);
})

app.get('/case-cinematografiche/:id', (req, res) => {
  for (let i = 0; i < caseCinematografiche.length; i++) {
    if (caseCinematografiche[i].id == req.params.id) {
      res.send(caseCinematografiche[i]);
      return
    }
  }
  res.status(404).end()
})

app.delete('/case-cinematografiche/:id', (req, res) => {
  let index = -1

  for (let i = 0; i < caseCinematografiche.length; i++) {
    if (caseCinematografiche[i].id == req.params.id) {
      index = i
    }
  }
  if (index == -1) {
    res.status(404).end()
  } else {
    caseCinematografiche.splice(index, 1)
    res.status(200).end()
  }
})

app.put('/case-cinematografiche/:id', (req, res) => {
  for (let i = 0; i < caseCinematografiche.length; i++) {
    if (caseCinematografiche[i].id == req.params.id) {
      caseCinematografiche[i] = { ...caseCinematografiche[i], ...req.body }
      res.status(200).end()
      return
    }
  }
  res.status(404).end()
})

app.post("/case-cinematografiche", (req, res) => {
  NEXT_ID++
  caseCinematografiche.push({ ...req.body, ...{ id: NEXT_ID } })
  res.status(200).end()

  res.status(400).end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
