import  mysql from "mysql2"
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
}).promise();
export async function getArtists(){
    const [rows] = await pool.query("SELECT * FROM artist")
    return rows
}
export async function getArtist(artist_id){
    const [rows] = await pool.query(`
    SELECT * 
    FROM artist
    WHERE artist_id = ?
    `,[artist_id])
    return rows[0]
}
export async function getSongs(){
    const [rows] = await pool.query(`SELECT * FROM songs`)
    return rows[0]
}
export async function getSong(song_id){
    const [rows] = await pool.query(`SELECT * FROM songs
     WHERE song_id = ?`,[song_id])
    return rows[0]
}
export async function joinArtist(artist_name, genre){
    const result = await pool.query(
        `INSERT INTO artist (artist_name,genre)
        values (?,?)
        `,[artist_name,genre] 
    )
    const id = result.insertId
    return getArtist(id)
}
export async function createSong(song_name,artist_id){
    const result = await pool.query(
        `INSERT INTO songs (song_name,artist_id)
        VALUES (?,?)`,[song_name,artist_id]
    )
    const id = result.insertId
    return getSong(id)
}
export async function userSongPlay(user_id,song_id){
    const result = await pool.query(`INSERT INTO user_song_play(user_id,song_id) VALUES (?,?)`,[user_id,song_id]);
}
//Group By
export async function veteranArtist(){
    const [rows] = await pool.query(`SELECT * FROM songs WHERE artist_id IN 
    (SELECT artist_id FROM songs GROUP BY artist_id 
        HAVING COUNT(*)>1);`)
    return rows;
}
//Aggregate function
export async function maxPlayed(){
    const [rows] = await pool.query(`SELECT *
    FROM songs
    WHERE total_times_played = (
        SELECT MAX(total_times_played)
        FROM songs
    );
    `);
    return rows;
}
//Nested query
export async function genre(){
    const [rows] = await pool.query(`SELECT * FROM songs WHERE artist_id IN (SELECT artist_id FROM artist WHERE genre = "Rock")`);
    return rows;
}
//Like operator
export async function ArtistWithStartN(){
    const rows = await pool.query(`SELECT * FROM artist WHERE artist_name LIKE "N%"`);
    return rows;
}
// Order by
export async function TopSongs(){
    const [rows] = await pool.query(`SELECT * FROM songs ORDER BY total_times_played DESC LIMIT 2`);
    return rows;
}
