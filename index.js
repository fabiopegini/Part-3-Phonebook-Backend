const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get("/", (req, res) => {
  res.send('<h1>Welcome! You might be looking for this: <a href="http://localhost:3001/api/persons">Persons JSON</a></h1>')
})

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><div>${new Date().toString()}</div>`)
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params
  const person = persons.find(person => person.id.toString() === id)
  if(person) return res.json(person)

  res.statusMessage = "Sorry, the resource you are looking for could not be found or does not exist"
  return res.status(404).send({error: "Person not found"})
})

app.post("/api/persons", (req, res) => {
  const newPerson = req.body

  if(!newPerson.name || !newPerson.number) return res.status(400).send({error: "Missing data, the person must have a Name and a Number"})
  
  const alreadyExists = persons.find(person => person.name === newPerson.name)
  if(alreadyExists) return res.status(400).send({error: "The person was already added to the phonebook"})

  newPerson.id = Math.floor(Math.random() * 9000)
  persons.push(newPerson)

  return res.status(200).send({success: "The person was added successfully", data: newPerson})
})

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params
  persons = persons.filter(person => person.id.toString() !== id)

  return res.status(200).send({success: "The person was deleted successfully", data: id})
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})