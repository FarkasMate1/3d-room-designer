CREATE DATABASE IF NOT EXISTS room_designer;
USE room_designer;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  room_type VARCHAR(20) NOT NULL DEFAULT 'bedroom',
  width FLOAT NOT NULL DEFAULT 5,
  length FLOAT NOT NULL DEFAULT 5,
  wall_color VARCHAR(7) DEFAULT '#ffffff',
  floor_color VARCHAR(7) DEFAULT '#cccccc',
  ceiling_color VARCHAR(7) DEFAULT '#ffffff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ha már létezik a tábla a meglévő adatbázisban, futtasd ezt a phpMyAdmin SQL fülén:
-- ALTER TABLE rooms
--   ADD COLUMN room_type VARCHAR(20) NOT NULL DEFAULT 'bedroom',
--   ADD COLUMN width FLOAT NOT NULL DEFAULT 5,
--   ADD COLUMN length FLOAT NOT NULL DEFAULT 5;

CREATE TABLE furniture_placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  model_type VARCHAR(50) NOT NULL,
  pos_x FLOAT DEFAULT 0,
  pos_y FLOAT DEFAULT 0,
  pos_z FLOAT DEFAULT 0,
  rot_y FLOAT DEFAULT 0,
  color VARCHAR(7) DEFAULT '#8B4513',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
