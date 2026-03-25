const mongoose = require("mongoose")

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url, {dbName: 'phonebook'})
  .then(res => console.log("connected successfully"))
  .catch(err => console.log("An error has occurred trying to connect to db", err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)