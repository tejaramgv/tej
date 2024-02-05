const express = require('express')
const app = express()
const {open} = require('sqlite')

app.use(express.json())
const sqlite3 = require('sqlite3')
const path = require('path')

const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null
const func = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3003, () => {
      console.log('Running on 3000')
    })
  } catch (err) {
    console.log(err)
  }
}
func()
app.get('/players/', async (request, response) => {
  const query = `select * from cricket_team`
  const list = await db.all(query)
  response.send(list)
  console.log(list)
})

app.post('/players/', async (req, res) => {
  const details = req.body
  const {playerName, jerseyNumber, role} = details

  const query2 = `insert into cricket_team (player_name,jersey_number,role)  values('${playerName}','${jerseyNumber}','${role}')`
  await db.run(query2)
  res.send('Player Added to Team')
})
app.get('/players/:playerId/', async (req, res) => {
  const {playerId} = req.params
  const query3 = `select * from cricket_team where player_id="${playerId}"`
  const re = await db.get(query3)
  console.log(re)
  res.send(re)
})

app.put('/players/:playerId', async (req, res) => {
  const {playerId} = req.params
  const detail = req.body
  const {playerName, jerseyNumber, role} = detail
  const quer = `update cricket_team set player_name="${playerName}",jersey_number="${jerseyNumber}",role="${role}" where player_id=${playerId}`
  await db.run(quer)
  res.send('Player Details Updated')
})

app.delete('/players/:playerId', async (req, res) => {
  const {playerId} = req.params
  const qw = `delete from cricket_team where player_id=${playerId}`
  await db.run(qw)
  res.send('Player Removed')
})

module.exports = app
