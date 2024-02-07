CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    song_name VARCHAR(100) NOT NULL,
    artist_id INT,
    total_times_played INT DEFAULT 0,
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id)
);
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    song_id INT,
    times_played INT DEFAULT 0,
);
 CREATE TABLE artist (
     artist_id integer PRIMARY KEY AUTO_INCREMENT,
     artist_name VARCHAR(50) NOT NULL,
     genre VARCHAR(20) NOT NULL,
     created TIMESTAMP NOT NULL DEFAULT NOW()
 );
CREATE TABLE user_song_play (
    user_id INT,
    song_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id),
    PRIMARY KEY (user_id, song_id);
);

DELIMITER $$
CREATE TRIGGER update_song_play_count AFTER INSERT ON user_song_play
FOR EACH ROW
BEGIN
    DECLARE songCount INT;
    SELECT total_times_played INTO songCount FROM songs WHERE song_id = NEW.song_id;
    SET songCount = songCount + 1;
    UPDATE songs SET total_times_played = songCount WHERE song_id = NEW.song_id;
END$$
DELIMITER;

DELIMITER $$
CREATE TRIGGER individual_user_update 
AFTER INSERT ON user_song_play
FOR EACH ROW
BEGIN
    DECLARE songCount INT;
    DECLARE user_name VARCHAR(50);
    SELECT times_played INTO songCount FROM users WHERE song_id = NEW.song_id;
    IF songCount IS NOT NULL THEN
        SET songCount = songCount + 1;
        UPDATE users SET times_played = songCount WHERE song_id = NEW.song_id;
    ELSE
        SET user_name = (SELECT username FROM users WHERE user_id = NEW.user_id);
        INSERT INTO users (username, song_id, times_played) VALUES (user_name,NEW.song_id, 1);
    END IF;
END$$
DELIMITER;
-- select sum(times_played) from users
--     -> where song_id = 4;



