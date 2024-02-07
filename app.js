import express from 'express'

const app = express()

app.use(express.json())
import {
    getArtist,
    getArtists,
    createSong,
    getSong,
    getSongs,
    veteranArtist,
    maxPlayed,
    genre,
    ArtistWithStartN,
    TopSongs
} from './databases.js'

app.get("/artist",async (req,res)=>{
    const artist = await getArtists();
    res.send(artist);
})
app.get("/artist/:id",async (req,res)=>{
    const id = req.params.id;
    const note = await getArtist(id);
    res.send(note)
})
app.get('/songs/:id',async (req, res) => {
  const id = req.params.id;
  const song = await getSong(id);
  res.send(song)
  });
app.get("/songs",async (req,res)=>{
  const songs = await getSongs();
  res.send(songs);
})

app.post("/song",async (req,res)=>{
  const { song_name, artist_id } = req.body;
  const song = await createSong(song_name,artist_id);
  res.send(song);
})

app.get('/veteranArtist',async (req,res)=>{
  const songs = await veteranArtist();
  res.send(songs);
})
app.get('/maxPlayed', async (req, res) => {
  const song = await maxPlayed();
  res.send(song);
});

app.get('/genre', async (req, res) => {
  const Artist = await genre();
  res.send(Artist);
});
app.get('/ArtistWithStartN', async (req, res) => {
  const artist = await ArtistWithStartN(); 
  res.send(artist);
});
app.get('/TopSongs', async (req, res) => {
  const top = await TopSongs();
  res.send(top);
});

app.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

  

app.listen(8080,()=>{
    console.log('Server is running on port 8080')
})

