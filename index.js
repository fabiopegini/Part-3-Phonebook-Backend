require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const Person = require('./models/person.js')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
  res.send('<h1>Welcome! You might be looking for this: <a href="http://localhost:3001/api/persons">Persons JSON</a></h1>')
})

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    return res.send(`<p>Phonebook has info for ${persons.length} people</p><div>${new Date().toString()}</div>`)
  })
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params

  return Person.findById(id)
    .then(person => {
      if(person) return res.json(person)

      res.statusMessage = "Sorry, the resource you are looking for could not be found or does not exist"
      return res.status(404).send({error: "Person not found"})
    })
    .catch(error => next(error))
})

app.post("/api/persons", async (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number) return res.status(400).send({error: "Missing data, the person must have a Name and a Number"})
  
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  return newPerson.save()
    .then(savedPerson => res.status(201).send({success: `The person ${savedPerson.name} was added successfully`, savedPerson}))
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params
  const body = req.body
  const newNumber = body.number

  if(!newNumber) return res.status(400).send({error: "You must provide a number"})

  return Person.findByIdAndUpdate(id, {number: newNumber}, {returnDocument: 'after', runValidators: true})
    .then(updatedPerson => res.status(200).send({success: `The number of ${updatedPerson.name} was successfully modified`, updatedPerson}))
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params

  return Person.findByIdAndDelete(id)
  .then(result => res.status(204).end())
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if(error.name === "CastError") return response.status(400).send({error: "Malformatted ID"})
  if(error.name === "ValidationError") return response.status(400).json({error: error.message})
  
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})