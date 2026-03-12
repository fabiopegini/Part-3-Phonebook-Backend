const express = require("express")
const app = express()

app.use(express.json())

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
  return res.status(404).send("Person not found")
})

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params
  persons = persons.filter(person => person.id.toString() !== id)

  return res.status(204).end()
})


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})