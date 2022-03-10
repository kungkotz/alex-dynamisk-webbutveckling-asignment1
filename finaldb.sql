-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table alexander_photos.albums
DROP TABLE IF EXISTS `albums`;
CREATE TABLE IF NOT EXISTS `albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table alexander_photos.albums: ~5 rows (approximately)
DELETE FROM `albums`;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` (`id`, `title`, `user_id`) VALUES
	(1, 'springfield', 1),
	(2, 'Places I hate', 1),
	(3, 'Nuked Locations', 2),
	(4, 'Aladeen album', 2),
	(5, 'Cute puppies', 3);
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;

-- Dumping structure for table alexander_photos.albums_photos
DROP TABLE IF EXISTS `albums_photos`;
CREATE TABLE IF NOT EXISTS `albums_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `album_id` int(11) DEFAULT NULL,
  `photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `album_id` (`album_id`),
  KEY `photo_id` (`photo_id`),
  CONSTRAINT `albums_photos_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`),
  CONSTRAINT `albums_photos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table alexander_photos.albums_photos: ~1 rows (approximately)
DELETE FROM `albums_photos`;
/*!40000 ALTER TABLE `albums_photos` DISABLE KEYS */;
INSERT INTO `albums_photos` (`id`, `album_id`, `photo_id`) VALUES
	(1, 5, 5);
/*!40000 ALTER TABLE `albums_photos` ENABLE KEYS */;

-- Dumping structure for table alexander_photos.photos
DROP TABLE IF EXISTS `photos`;
CREATE TABLE IF NOT EXISTS `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(200) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table alexander_photos.photos: ~5 rows (approximately)
DELETE FROM `photos`;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` (`id`, `url`, `comment`, `title`, `user_id`) VALUES
	(1, 'www.springfield.com/powerplant', 'Leaking Reactor', 'Power Plant', 1),
	(2, 'www.springfield.com/krusty', 'I ate a burger', 'Krusty Burger', 1),
	(3, 'www.springfield.com/alienship', 'They took me on a ride', 'Alien ship in Spriengfield', 1),
	(4, 'www.nukedlocations.com/wadiyacerealfactory', 'No toy in the package', 'Wadiya Cereal Center', 2),
	(5, 'www.myphotos.com/husky', 'Cute Husky I saw in Moscow', 'Siberian Husky', 3);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;

-- Dumping structure for table alexander_photos.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `first_name` varchar(200) DEFAULT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table alexander_photos.users: ~3 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
	(1, 'burns@burns.com', '$2b$08$Krn/sBMXwRUwMFauZcMC.Oe83KucuswBLR9LAYk4vvdLwJI1IfX9a', 'Charles', 'Burns'),
	(2, 'thedictator@wadiya.gov', '$2b$08$2FG9lMpN2YwcV10Mj73N2O4SsUv3qiLZbetEx0Zhwo21RDeB.ehaK', 'Haffaz', 'Aladeen'),
	(3, 'vladimirputin@rus.gov', '$2b$08$gIELO7XINhh19gbQ.6UdweFvDJbISFIvQtvB7kCk0BuJuI6QpapcK', 'Vladimir', 'Putin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
