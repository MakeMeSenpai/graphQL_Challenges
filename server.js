require("dotenv").config
const fetch = require('node-fetch');
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')


const schema = buildSchema(`
  enum Units {
    standard
    metric
    imperial
  }

  type Weather {
    temperature: Float
    description: String
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Float
    humidity: Float
    cod: Int
    message: String
  }

  type Pet {
    name: String!
    species: String!
  }

  type Mutation {
    addPet(name: String!, species: String!): Pet!
    updatePet(id: Int!, name: String, species: String): Pet
    removePet(id: Int!): Pet
  }

  type Query {
    getWeather(zip: Int!, units: Units): Weather!
  }`)

const petList = []
const root = {
  getWeather: async ({ zip, units }) => {
		const apikey = process.env.API_KEY
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
		const res = await fetch(url)
		const json = await res.json()
    const cod = json.cod
    let temperature = null
	  let description = null
    let feels_like = null
    let temp_min = null
    let temp_max = null
    let pressure = null
    let humidity = null
    let message = "City Not Found"
    if (cod != "404"){
      temperature = json.main.temp
      description = json.weather[0].description
      feels_like = json.main.feels_like
      temp_min = json.main.temp_min
      temp_max = json.main.temp_max
      pressure = json.main.pressure
      humidity = json.main.humidity
      message = "City Found"
    }
		return { temperature, description, feels_like, temp_min, temp_max, pressure, humidity, cod, message }
	},
  addPet: ({ name, species }) => {
		const pet = { name, species }
		petList.push(pet)
		return pet
	},
  updatePet: ({ id, name, species }) => {
		const pet = petList[id]  // is there anything at this id? 
		if (pet === undefined) { // Id not return null
			return null 
		}
    // if name or species was not included use the original
		pet.name = name || pet.name 
		pet.species = species || pet.species
		return pet
	},
  readPet: ({ id }) => {
    // checks if pet exists at index/id
    if (petList[id] === undefined) {
      return null
    }
    // returns deleted item
    return petList[id]
  },
  removePet: ({ id }) => {
    // checks if pet exists at index/id
    if (petList[id] === undefined) {
      return null
    }
    // returns deleted item
    return petList.splice(id, 1)
  }
}

// Create an express app
const app = express()
app.use(cors())

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log('Running on port:'+port)
})
