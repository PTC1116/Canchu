-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: Canchu
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*CREATE USER IF NOT EXISTS '$MYSQL_USER'@'$MYSQL_HOST' IDENTIFIED BY '$MYSQL_PASSWORD';*/
/*ALTER USER '$MYSQL_USER'@'$MYSQL_HOST' IDENTIFIED BY '$MYSQL_PASSWORD';*/
/*ALTER USER 'root'@'localhost' IDENTIFIED BY 'happy1234';*/
/*CREATE USER 'canchu'@'localhost' IDENTIFIED BY 'happy1234';
GRANT ALL PRIVILEGES ON Canchu.* TO 'canchu'@'localhost';
FLUSH PRIVILEGES;*/

/*CREATE USER 'canchu'@'192.168.144.4' IDENTIFIED BY 'happy1234';
GRANT ALL PRIVILEGES ON Canchu.* TO 'canchu'@'192.168.144.4';
FLUSH PRIVILEGES;*/
/*CREATE USER 'root'@'192.168.176.4' IDENTIFIED BY 'happy1234';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.176.4';
FLUSH PRIVILEGES;*/

CREATE DATABASE IF NOT EXISTS Canchu;
CREATE USER IF NOT EXISTS 'canchu'@'192.168.144.4' IDENTIFIED BY 'happy1234';
GRANT ALL PRIVILEGES ON Canchu.* TO 'canchu'@'192.168.144.4';
FLUSH PRIVILEGES;
--
-- Table structure for table `comments`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` int NOT NULL,
  `post` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_author_user` (`author`),
  KEY `FK_post` (`post`),
  CONSTRAINT `FK_author_user` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_post` FOREIGN KEY (`post`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,111,2,'test comment','2023-07-13 12:34:32'),(2,112,3,'test comment','2023-07-13 14:52:37'),(3,115,4,'test comment','2023-07-14 06:14:22'),(4,116,5,'test comment','2023-07-14 06:14:24'),(5,117,6,'test comment','2023-07-14 06:21:45'),(6,153,69,'1234567','2023-07-17 15:43:56'),(7,166,73,'你是一隻水豚','2023-07-20 11:30:09'),(8,167,73,'你是一隻水豚','2023-07-20 11:30:47'),(9,163,73,'你是一隻水豚','2023-07-20 11:49:30'),(10,168,96,'留言 1','2023-07-20 14:39:06'),(11,168,96,'xu.6u06','2023-07-20 14:39:10'),(12,159,70,'萌','2023-07-20 15:34:49'),(13,157,73,'你是一隻水豚','2023-07-28 00:05:35');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) DEFAULT NULL,
  `performer_id` int DEFAULT NULL,
  `recipient_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `summary` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_performer_user` (`performer_id`),
  KEY `FK_recipient_user` (`recipient_id`),
  CONSTRAINT `FK_performer_user` FOREIGN KEY (`performer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_recipient_user` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'friend_request',41,42,0,'2023-07-12 03:30:51','user-uYM7hw6n邀請你成為好友'),(2,'friend_request',42,41,0,'2023-07-12 03:30:51','user-kOselAHo接受了你的好友邀請'),(3,'friend_request',43,44,0,'2023-07-12 03:31:03','user-RU0ql3Ul邀請你成為好友'),(4,'friend_request',44,43,0,'2023-07-12 03:31:04','user-jIElC28p接受了你的好友邀請'),(5,'friend_request',45,46,0,'2023-07-12 03:32:59','user-RsnNnPCT邀請你成為好友'),(6,'friend_request',46,45,1,'2023-07-12 03:33:00','user-o2DZApLE接受了你的好友邀請'),(7,'friend_request',47,48,0,'2023-07-12 03:33:25','user-KkbAYD9x邀請你成為好友'),(8,'friend_request',48,47,1,'2023-07-12 03:33:25','user-O87crwcN接受了你的好友邀請'),(9,'friend_request',49,50,0,'2023-07-12 10:43:17','user-M2awzm94邀請你成為好友'),(10,'friend_request',50,49,0,'2023-07-12 10:43:17','user-w89qKW23接受了你的好友邀請'),(11,'friend_request',52,53,0,'2023-07-12 10:57:56','user-7kqlc0T8邀請你成為好友'),(12,'friend_request',53,52,0,'2023-07-12 10:57:56','user-f65N4MIn接受了你的好友邀請'),(13,'friend_request',55,56,0,'2023-07-12 10:57:59','user-9kfZ7WGI邀請你成為好友'),(14,'friend_request',56,55,0,'2023-07-12 10:57:59','user-tl5WePoF接受了你的好友邀請'),(15,'friend_request',58,59,0,'2023-07-12 11:37:34','user-x39X5YdM邀請你成為好友'),(16,'friend_request',59,58,0,'2023-07-12 11:37:35','user-8LS3Gr8k接受了你的好友邀請'),(17,'friend_request',61,62,0,'2023-07-12 11:37:37','user-nISXA9Pe邀請你成為好友'),(18,'friend_request',62,61,0,'2023-07-12 11:37:38','user-coJ068Pp接受了你的好友邀請'),(19,'friend_request',64,65,0,'2023-07-12 12:11:31','user-06adnVR8邀請你成為好友'),(20,'friend_request',65,64,0,'2023-07-12 12:11:31','user-7cGcDt2U接受了你的好友邀請'),(21,'friend_request',67,68,0,'2023-07-12 12:11:34','user-CPgES6fA邀請你成為好友'),(22,'friend_request',68,67,0,'2023-07-12 12:11:34','user-ExoX0VAT接受了你的好友邀請'),(23,'friend_request',70,71,0,'2023-07-12 12:39:24','user-TjHfjz7B邀請你成為好友'),(24,'friend_request',71,70,0,'2023-07-12 12:39:25','user-BkoJQtEN接受了你的好友邀請'),(25,'friend_request',73,74,0,'2023-07-12 12:39:27','user-38V4GvGO邀請你成為好友'),(26,'friend_request',74,73,0,'2023-07-12 12:39:27','user-h7NFHYk2接受了你的好友邀請'),(27,'friend_request',76,77,0,'2023-07-12 15:27:20','user-QncsIdLd邀請你成為好友'),(28,'friend_request',77,76,0,'2023-07-12 15:27:20','user-laSyJgFI接受了你的好友邀請'),(29,'friend_request',79,80,0,'2023-07-12 15:27:23','user-eara8qNG邀請你成為好友'),(30,'friend_request',80,79,0,'2023-07-12 15:27:23','user-C0ADpJAy接受了你的好友邀請'),(31,'friend_request',82,83,0,'2023-07-12 15:27:58','user-DRhETaxH邀請你成為好友'),(32,'friend_request',83,82,0,'2023-07-12 15:27:58','user-7IdKPV2K接受了你的好友邀請'),(33,'friend_request',85,86,0,'2023-07-13 01:40:32','user-MoQ0oyd9邀請你成為好友'),(34,'friend_request',86,85,0,'2023-07-13 01:40:32','user-Db03Lq5d接受了你的好友邀請'),(35,'friend_request',88,89,0,'2023-07-13 01:42:51','user-tGxw1gcY邀請你成為好友'),(36,'friend_request',89,88,0,'2023-07-13 01:42:51','user-kzeoTelS接受了你的好友邀請'),(37,'friend_request',91,92,0,'2023-07-13 02:21:58','user-vdFI2OsI邀請你成為好友'),(38,'friend_request',92,91,0,'2023-07-13 02:21:59','user-0kdeVoaT接受了你的好友邀請'),(39,'friend_request',94,95,0,'2023-07-13 02:22:01','user-FJgfUBim邀請你成為好友'),(40,'friend_request',95,94,0,'2023-07-13 02:22:02','user-f7Nf3FcX接受了你的好友邀請'),(41,'friend_request',97,98,0,'2023-07-13 02:24:53','user-12vyXQCJ邀請你成為好友'),(42,'friend_request',98,97,0,'2023-07-13 02:24:53','user-a4Y2rcNc接受了你的好友邀請'),(43,'friend_request',100,101,0,'2023-07-13 02:26:42','user-gcyhwanl邀請你成為好友'),(44,'friend_request',101,100,0,'2023-07-13 02:26:43','user-a5YK0K8i接受了你的好友邀請'),(45,'friend_request',103,104,0,'2023-07-13 02:35:21','user-yRbC3WCk邀請你成為好友'),(46,'friend_request',104,103,0,'2023-07-13 02:35:21','user-wDRaXe4v接受了你的好友邀請'),(47,'friend_request',106,107,0,'2023-07-13 02:35:24','user-y2tmmpJ8邀請你成為好友'),(48,'friend_request',107,106,0,'2023-07-13 02:35:24','user-zw6iPWOm接受了你的好友邀請'),(49,'friend_request',118,119,0,'2023-07-14 10:51:43','user-R0EyxxMv邀請你成為好友'),(50,'friend_request',119,118,0,'2023-07-14 10:51:43','user-5uuvaLyx接受了你的好友邀請'),(51,'friend_request',121,122,0,'2023-07-14 11:01:44','user-XXcr31b6邀請你成為好友'),(52,'friend_request',122,121,0,'2023-07-14 11:01:44','user-PzEHHfxx接受了你的好友邀請'),(53,'friend_request',124,125,0,'2023-07-14 11:01:57','user-XBsCVVGq邀請你成為好友'),(54,'friend_request',125,124,0,'2023-07-14 11:01:57','user-tpHUxIZx接受了你的好友邀請'),(55,'friend_request',127,128,0,'2023-07-14 11:27:35','user-EhgRMwrH邀請你成為好友'),(56,'friend_request',128,127,0,'2023-07-14 11:27:36','user-RzWJ6per接受了你的好友邀請'),(57,'friend_request',130,131,0,'2023-07-14 11:27:38','user-1jCpZgmJ邀請你成為好友'),(58,'friend_request',131,130,0,'2023-07-14 11:27:39','user-SknmTeip接受了你的好友邀請'),(59,'friend_request',133,134,0,'2023-07-14 11:41:38','user-xj0iSUnk邀請你成為好友'),(60,'friend_request',134,133,0,'2023-07-14 11:41:38','user-O3z7AJu3接受了你的好友邀請'),(61,'friend_request',136,137,0,'2023-07-14 11:41:41','user-15A6MqAO邀請你成為好友'),(62,'friend_request',137,136,0,'2023-07-14 11:41:42','user-afyuWj88接受了你的好友邀請'),(63,'friend_request',139,140,0,'2023-07-14 11:43:35','user-U2yPFZNi邀請你成為好友'),(64,'friend_request',140,139,0,'2023-07-14 11:43:35','user-wjxECcMX接受了你的好友邀請'),(65,'friend_request',142,143,0,'2023-07-14 11:43:41','user-8KdBqGtW邀請你成為好友'),(66,'friend_request',143,142,0,'2023-07-14 11:43:41','user-5B0Uolh3接受了你的好友邀請'),(67,'friend_request',145,146,0,'2023-07-14 11:58:45','user-Qk6RQA5t邀請你成為好友'),(68,'friend_request',146,145,0,'2023-07-14 11:58:45','user-gkR11Tqj接受了你的好友邀請'),(69,'friend_request',148,149,0,'2023-07-14 11:58:52','user-udMBkCgU邀請你成為好友'),(70,'friend_request',149,148,0,'2023-07-14 11:58:52','user-Da7j6DxK接受了你的好友邀請'),(71,'friend_request',151,152,0,'2023-07-17 09:32:56','user-jzYpIq6M邀請你成為好友'),(72,'friend_request',152,151,0,'2023-07-17 09:32:56','user-Gnb6fmw7接受了你的好友邀請'),(73,'friend_request',157,156,1,'2023-07-19 05:24:34','Penguin邀請你成為好友'),(74,'friend_request',156,157,1,'2023-07-19 05:33:54','duck邀請你成為好友'),(75,'friend_request',157,156,0,'2023-07-19 05:34:41','Penguin接受了你的好友邀請'),(76,'friend_request',157,6,0,'2023-07-19 05:52:04','Penguin邀請你成為好友'),(81,'friend_request',161,159,0,'2023-07-19 07:56:56','cat接受了你的好友邀請'),(82,'friend_request',163,160,0,'2023-07-19 07:57:36','fox邀請你成為好友'),(83,'friend_request',160,159,0,'2023-07-19 07:57:56','raccoon接受了你的好友邀請'),(84,'friend_request',160,163,1,'2023-07-19 07:57:59','raccoon接受了你的好友邀請'),(85,'friend_request',163,157,1,'2023-07-20 02:40:02','fox邀請你成為好友'),(86,'friend_request',163,161,0,'2023-07-20 02:40:13','fox邀請你成為好友'),(87,'friend_request',163,156,0,'2023-07-20 02:40:23','fox邀請你成為好友'),(88,'friend_request',166,163,1,NULL,'Orca邀請你成為好友'),(89,'test',4,5,0,NULL,'test'),(90,'test',4,5,0,'2023-07-20 19:05:37','test'),(91,'test',4,5,0,'2023-07-20 11:06:17','test'),(92,'friend_request',166,163,1,'2023-07-20 11:09:12','Orca邀請你成為好友'),(93,'friend_request',163,159,1,'2023-07-20 11:10:36','fox邀請你成為好友'),(94,'friend_request',159,163,0,'2023-07-20 11:11:10','Capybara接受了你的好友邀請'),(95,'friend_request',159,166,0,'2023-07-20 11:18:09','Capybara接受了你的好友邀請'),(96,'friend_request',159,167,0,'2023-07-20 11:18:12','Capybara接受了你的好友邀請'),(97,'friend_request',156,159,0,'2023-07-20 11:18:48','duck接受了你的好友邀請'),(98,'friend_request',157,159,0,'2023-07-20 11:19:06','Penguin接受了你的好友邀請'),(99,'friend_request',159,166,1,'2023-07-20 14:33:55','Capybara邀請你成為好友'),(100,'friend_request',166,159,0,'2023-07-20 14:34:20','Orca接受了你的好友邀請'),(101,'friend_request',169,168,0,'2023-07-20 14:40:38','pj2邀請你成為好友'),(102,'friend_request',169,168,0,'2023-07-20 14:40:43','pj2邀請你成為好友'),(103,'friend_request',169,168,1,'2023-07-20 14:40:58','pj2邀請你成為好友'),(104,'friend_request',168,169,0,'2023-07-20 14:41:05','pj接受了你的好友邀請'),(105,'friend_request',163,159,1,'2023-07-28 00:22:20','fox邀請你成為好友'),(106,'friend_request',159,163,0,'2023-07-28 00:22:46','Capybara接受了你的好友邀請');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requester_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_request_user` (`requester_id`),
  KEY `FK_receive_user` (`receiver_id`),
  CONSTRAINT `FK_receive_user` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_request_user` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,20,21,'requested'),(2,22,23,'requested'),(3,24,25,'requested'),(4,33,34,'friend'),(5,35,36,'friend'),(12,41,42,'requested'),(13,43,44,'requested'),(14,45,46,'friend'),(15,47,48,'friend'),(16,49,50,'friend'),(17,52,53,'friend'),(18,55,56,'friend'),(19,58,59,'friend'),(20,61,62,'friend'),(21,64,65,'friend'),(22,67,68,'friend'),(23,70,71,'friend'),(24,73,74,'friend'),(25,76,77,'friend'),(26,79,80,'friend'),(27,82,83,'friend'),(28,85,86,'friend'),(29,88,89,'friend'),(30,91,92,'friend'),(31,94,95,'friend'),(32,97,98,'friend'),(33,100,101,'friend'),(34,103,104,'friend'),(35,106,107,'friend'),(36,118,119,'friend'),(37,121,122,'friend'),(38,124,125,'friend'),(39,127,128,'friend'),(40,130,131,'friend'),(41,133,134,'friend'),(42,136,137,'friend'),(43,139,140,'friend'),(44,142,143,'friend'),(45,145,146,'friend'),(46,148,149,'friend'),(47,151,152,'friend'),(50,157,5,'requested'),(51,157,13,'requested'),(52,157,6,'requested'),(56,159,157,'friend'),(58,159,161,'friend'),(59,159,156,'friend'),(61,163,160,'friend'),(67,167,163,'requested'),(68,167,159,'friend'),(69,163,157,'requested'),(70,163,161,'requested'),(71,163,156,'requested'),(74,166,163,'requested'),(76,159,166,'friend'),(79,169,168,'friend'),(80,163,159,'friend');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_members_group` (`group_id`),
  KEY `FK_members_user_data` (`user_id`),
  CONSTRAINT `FK_members_group` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_members_user_data` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (1,1,170,'creator'),(2,2,170,'creator'),(3,3,171,'creator'),(5,1,173,'member'),(6,1,171,'member'),(7,1,172,'member'),(8,2,172,'pending'),(9,3,172,'member'),(10,3,174,'member'),(11,2,174,'pending'),(14,3,170,'member'),(16,1,174,'member'),(17,6,170,'creator'),(18,6,171,'member'),(19,7,170,'creator'),(20,8,170,'creator'),(22,10,180,'creator'),(23,10,181,'member');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_posts`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `group_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `context` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_post_group` (`group_id`),
  KEY `FK_post_user_data` (`user_id`),
  CONSTRAINT `FK_post_group` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_post_user_data` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_posts`
--

LOCK TABLES `group_posts` WRITE;
/*!40000 ALTER TABLE `group_posts` DISABLE KEYS */;
INSERT INTO `group_posts` VALUES (1,1,170,'值得紀念的第一篇社團貼文','2023-07-28 16:43:59'),(2,1,171,'值得紀念的第二篇社團貼文','2023-07-28 16:54:33'),(3,1,172,'值得紀念的第三篇社團貼文','2023-07-28 16:54:58'),(4,3,171,'在自己社團也發一下','2023-07-28 16:57:17'),(5,1,172,'同一個人發兩篇','2023-07-28 16:57:45'),(6,1,172,'發三篇就要觀看 m25','2023-07-28 16:58:09'),(7,1,170,'值得紀念的第一篇社團貼文','2023-07-28 17:43:10'),(8,3,170,'哈哈我也來一下','2023-07-28 17:43:58'),(9,10,180,'user1 貼文 1','2023-07-29 23:47:52'),(10,10,181,'user2 貼文 1','2023-07-29 23:47:52');
/*!40000 ALTER TABLE `group_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `like_user` int NOT NULL,
  `post` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_like_post_info` (`post`),
  KEY `FK_like_user_data` (`like_user`),
  CONSTRAINT `FK_like_post_info` FOREIGN KEY (`post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_like_user_data` FOREIGN KEY (`like_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,110,1),(3,112,3),(4,115,4),(5,116,5),(6,117,6),(7,166,73),(10,167,73),(15,163,73),(16,161,73),(17,168,96),(18,159,70),(20,157,73);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_sender_user_data` (`sender`),
  KEY `FK_receiver_user_data` (`receiver`),
  CONSTRAINT `FK_receiver_user_data` FOREIGN KEY (`receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_sender_user_data` FOREIGN KEY (`sender`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (11,170,171,'跟171聊天很開心-1','2023-07-28 17:12:33'),(12,170,171,'跟171聊天很開心-2','2023-07-28 17:12:36'),(13,170,171,'跟171聊天很開心-3','2023-07-28 17:12:40'),(14,170,171,'跟171聊天很開心-4','2023-07-28 17:12:43'),(15,170,171,'跟171聊天很開心-5','2023-07-28 17:12:47'),(16,170,171,'跟171聊天很開心-6','2023-07-28 17:12:50'),(17,170,171,'跟171聊天很開心-7','2023-07-28 17:12:53'),(18,170,171,'跟171聊天很開心-8','2023-07-28 17:12:56'),(19,170,171,'跟171聊天很開心-9','2023-07-28 17:12:59'),(20,170,171,'跟171聊天很開心-10','2023-07-28 17:13:03'),(21,170,171,'跟171聊天很開心-11','2023-07-28 17:14:36'),(22,170,171,'跟171聊天很開心-12','2023-07-28 17:14:41'),(23,170,171,'跟171聊天很開心-13','2023-07-28 17:14:44'),(24,171,172,'跟172聊天很開心-1','2023-07-28 17:17:19'),(25,171,172,'跟172聊天很開心-2','2023-07-28 17:17:25'),(26,171,172,'跟172聊天很開心-3','2023-07-28 17:18:16'),(27,172,171,'172跟171聊天很開心-1','2023-07-28 17:19:04'),(28,172,171,'172跟171聊天很開心-2','2023-07-28 17:19:07'),(29,172,171,'172跟171聊天很開心-2','2023-07-28 17:19:27'),(30,172,174,'172跟174聊天很開心','2023-07-28 17:20:06'),(31,170,171,'跟171聊天很開心-13','2023-07-28 17:44:47'),(32,170,171,'跟171聊天很開心-13','2023-07-28 17:58:49'),(33,170,171,'跟171聊天很開心-13','2023-07-29 23:33:01'),(34,180,181,'user1 -> user2 訊息 1','2023-07-29 23:47:57'),(35,181,180,'user2 -> user1 訊息 1','2023-07-29 23:47:57'),(36,181,180,'user2 -> user1 訊息 2','2023-07-29 23:47:59'),(37,181,180,'user2 -> user1 訊息 3','2023-07-29 23:48:00'),(38,181,180,'user2 -> user1 訊息 4','2023-07-29 23:48:00'),(39,181,180,'user2 -> user1 訊息 5','2023-07-29 23:48:01'),(40,181,180,'user2 -> user1 訊息 6','2023-07-29 23:48:02'),(41,181,180,'user2 -> user1 訊息 7','2023-07-29 23:48:02'),(42,181,180,'user2 -> user1 訊息 8','2023-07-29 23:48:03'),(43,181,180,'user2 -> user1 訊息 9','2023-07-29 23:48:04'),(44,181,180,'user2 -> user1 訊息 10','2023-07-29 23:48:04');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `posted_by` int NOT NULL,
  `context` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_post_author_id` (`posted_by`),
  CONSTRAINT `FK_post_author_id` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,110,'test post 01','2023-07-13 12:32:28'),(2,111,'test post 01','2023-07-13 12:34:32'),(3,112,'test post 01','2023-07-13 14:52:37'),(4,115,'test post 01','2023-07-14 06:14:22'),(5,116,'test post 01','2023-07-14 06:14:24'),(6,117,'test post 01','2023-07-14 06:21:44'),(7,118,'test post 01','2023-07-14 10:51:43'),(8,121,'test post 01','2023-07-14 11:01:45'),(9,124,'test post 01','2023-07-14 11:01:58'),(10,127,'test post 01','2023-07-14 11:27:36'),(11,130,'test post 01','2023-07-14 11:27:39'),(12,133,'test post 01','2023-07-14 11:41:39'),(13,136,'test post 01','2023-07-14 11:41:42'),(14,139,'test post 01','2023-07-14 11:43:35'),(15,139,'test post 02','2023-07-14 11:43:36'),(16,139,'test post 03','2023-07-14 11:43:37'),(17,139,'test post 04','2023-07-14 11:43:37'),(18,139,'test post 05','2023-07-14 11:43:37'),(19,139,'test post 06','2023-07-14 11:43:37'),(20,139,'test post 07','2023-07-14 11:43:37'),(21,139,'test post 08','2023-07-14 11:43:38'),(22,139,'test post 09','2023-07-14 11:43:38'),(23,139,'test post 10','2023-07-14 11:43:38'),(24,139,'test post 11','2023-07-14 11:43:38'),(25,142,'test post 01','2023-07-14 11:43:42'),(26,142,'test post 02','2023-07-14 11:43:43'),(27,142,'test post 03','2023-07-14 11:43:43'),(28,142,'test post 04','2023-07-14 11:43:43'),(29,142,'test post 05','2023-07-14 11:43:43'),(30,142,'test post 06','2023-07-14 11:43:44'),(31,142,'test post 07','2023-07-14 11:43:44'),(32,142,'test post 08','2023-07-14 11:43:44'),(33,142,'test post 09','2023-07-14 11:43:44'),(34,142,'test post 10','2023-07-14 11:43:44'),(35,142,'test post 11','2023-07-14 11:43:45'),(36,145,'test post 01','2023-07-14 11:58:45'),(37,145,'test post 02','2023-07-14 11:58:46'),(38,145,'test post 03','2023-07-14 11:58:47'),(39,145,'test post 04','2023-07-14 11:58:47'),(40,145,'test post 05','2023-07-14 11:58:47'),(41,145,'test post 06','2023-07-14 11:58:47'),(42,145,'test post 07','2023-07-14 11:58:48'),(43,145,'test post 08','2023-07-14 11:58:48'),(44,145,'test post 09','2023-07-14 11:58:48'),(45,145,'test post 10','2023-07-14 11:58:48'),(46,145,'test post 11','2023-07-14 11:58:48'),(47,148,'test post 01','2023-07-14 11:58:52'),(48,148,'test post 02','2023-07-14 11:58:53'),(49,148,'test post 03','2023-07-14 11:58:54'),(50,148,'test post 04','2023-07-14 11:58:54'),(51,148,'test post 05','2023-07-14 11:58:54'),(52,148,'test post 06','2023-07-14 11:58:54'),(53,148,'test post 07','2023-07-14 11:58:54'),(54,148,'test post 08','2023-07-14 11:58:55'),(55,148,'test post 09','2023-07-14 11:58:55'),(56,148,'test post 10','2023-07-14 11:58:55'),(57,148,'test post 11','2023-07-14 11:58:55'),(58,151,'test post 01','2023-07-17 09:32:56'),(59,151,'test post 02','2023-07-17 09:32:57'),(60,151,'test post 03','2023-07-17 09:32:57'),(61,151,'test post 04','2023-07-17 09:32:58'),(62,151,'test post 05','2023-07-17 09:32:58'),(63,151,'test post 06','2023-07-17 09:32:58'),(64,151,'test post 07','2023-07-17 09:32:58'),(65,151,'test post 08','2023-07-17 09:32:59'),(66,151,'test post 09','2023-07-17 09:32:59'),(67,151,'test post 10','2023-07-17 09:32:59'),(68,151,'test post 11','2023-07-17 09:32:59'),(69,153,'test','2023-07-17 15:43:46'),(70,163,'我是一隻狐貍','2023-07-20 11:15:16'),(71,156,'我是一隻鴨子','2023-07-20 11:15:54'),(72,157,'我是一隻企鵝\n','2023-07-20 11:16:25'),(73,159,'我是一隻水豚','2023-07-20 11:16:47'),(74,161,'我是一隻貓','2023-07-20 11:19:26'),(75,167,'我是一隻水母','2023-07-20 11:20:01'),(76,166,'我是一隻虎鯨','2023-07-20 11:20:28'),(77,166,'1','2023-07-20 14:19:51'),(78,166,'2','2023-07-20 14:20:13'),(79,166,'3','2023-07-20 14:20:44'),(80,166,'4','2023-07-20 14:20:48'),(81,166,'5','2023-07-20 14:20:52'),(82,166,'6','2023-07-20 14:20:55'),(83,166,'7','2023-07-20 14:20:57'),(84,166,'8','2023-07-20 14:21:02'),(85,166,'9','2023-07-20 14:21:05'),(86,166,'10','2023-07-20 14:21:11'),(87,168,'貼文 1','2023-07-20 14:37:56'),(88,168,'貼文 2','2023-07-20 14:38:00'),(89,168,'貼文 3','2023-07-20 14:38:04'),(90,168,'貼文 4','2023-07-20 14:38:08'),(91,168,'貼文 5','2023-07-20 14:38:13'),(92,168,'貼文 6','2023-07-20 14:38:16'),(93,168,'貼文 7','2023-07-20 14:38:22'),(94,168,'貼文 8','2023-07-20 14:38:26'),(95,168,'貼文 9','2023-07-20 14:38:30'),(96,168,'貼文 10 edited','2023-07-20 14:38:34'),(97,169,'測試 1','2023-07-20 14:41:16');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `creator` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES (1,'祝福機構同好會',170),(2,'死神小學生同好會',170),(3,'我也要創社團',171),(6,'test',170),(7,'這會被我刪掉',170),(8,'這會被我刪掉',170),(10,'世紀帝國同好會',180);
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `picture` varchar(100) DEFAULT NULL,
  `friend_count` int DEFAULT NULL,
  `introduction` varchar(100) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `friendship` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pt','pt@test.com','$2a$10$/CUZKDRZkJGVuphoAHUbl.1LlB9shBz69h8o4qw/MkT5jxkjNfisK','native','public/image.jpg',NULL,'intro','tag',NULL),(2,'user-m34izb1F','user-m34izb1F@test.com','$2a$10$jZXXIWv/X8bdjyJjsf7gc.U8TQBukua8MO3ji4UyzIeZSsQIfCKny','native',NULL,NULL,NULL,NULL,NULL),(3,'user-y2iN7Ipb','user-y2iN7Ipb@test.com','$2a$10$8gLOW2YzgxFbQYwQxHoVEOMbSgmlANff/RdPoxucQAXtPvKz3ZL8S','native','https://13.211.10.154/pictures1689691801900-80465.jpg',NULL,NULL,NULL,NULL),(4,'user-NCRU7Omn','user-PggV3aXr@test.com','$2a$10$xaGSmdCeO0CpPOeIm1X6Te8EzTMivgS72bs8stKsHkXoWidpCsxcK','native','public/profile.png',NULL,'Ymi1UfFvqafSObaw4MlfttNagiTQLkIvlHQejaeKcFAI7jP0h3kjv51strY9j9tj','fbXenf,KCbAYq,k5pu34',NULL),(5,'user-fMckwGfo','user-fMckwGfo@test.com','$2a$10$DwykrEMGzxZC0FvwA7xxPuV5c6KTBeD.5tFHsX6p5XkjRWkhiAzje','native',NULL,NULL,NULL,NULL,NULL),(6,'user-HwaC8Uwd','user-eap8ThoI@test.com','$2a$10$ItWkz/uxkrwL1t/epJBKPuyuIA6guWOGugTjJaiVEB.PVfm8.Zgle','native','public/profile.png',NULL,'tOLXhYn07B7AradWs2lx9L8XCG7M661Y9EE3fNaw9eqbIqrCOeLs0JLCPlkkWq5G','QbukHn,NYdzMO,weJyJ7',NULL),(7,'user-Z5XuUFHe','user-Z5XuUFHe@test.com','$2a$10$eDOu6wmmgIF6dYeE.aa78.S.OcZlk5DiBWJ5K0voCWUFoeNmIlbt2','native',NULL,NULL,NULL,NULL,NULL),(8,'user-mRRA2oda','user-xX1Lj3O2@test.com','$2a$10$HZUtdq4lGJINI4x0H4ZhYe0dAvlotIkvlLHhRxpDiJhbDZxqmvCla','native','public/profile.png',NULL,'1Iq5MXx9uqOjFv7ktX8MV01da1mhv2pPxMKTB2ME5ZNA2EXoZ93ht7bbigbpTm6V','Xwk1mD,wQ0Bc4,qDKIXT',NULL),(9,'user-A1PceWPm','user-A1PceWPm@test.com','$2a$10$GoEvrNKC/vn2trTzWIc5L.jqLa3.vSrmgCiawPcMn1bFtN8YmeVfW','native',NULL,NULL,NULL,NULL,NULL),(10,'user-1LcXdUZn','user-UaQiPa37@test.com','$2a$10$4k6avnzfGN23ts9XJrCiV.F4MvLd5v75if.mJdH.2z3KZN9ywK2TK','native','public/1688956003139-464654535',NULL,'1JNAB7zGwDh8etfBmQ976pYRXffY8U5gXFHMgZIMQ2SDWcbCvcpQUmW9aTFp69Af','KEeXPc,C2Iqze,XLPr5u',NULL),(11,'user-l36OeDXF','user-l36OeDXF@test.com','$2a$10$.idVTjUfVv11QbJooIgIyuZHy2fREWnYNKX/69s5.5A8PvKO3KH8S','native',NULL,NULL,NULL,NULL,NULL),(12,'user-hMYfXIJH','user-hMYfXIJH@test.com','$2a$10$CbZhRP2mwzNw56dCQbVRx.RqO/ckMeRr2GCur1a/OJFDsHHUxg7JK','native',NULL,NULL,NULL,NULL,NULL),(13,'user-bbDSKIue','user-bbDSKIue@test.com','$2a$10$dHt.lp93KtrQXCBRB1qwBO.Bv91DoYwS/e6AuZqhXJ0Pglqv6Y2bW','native',NULL,NULL,NULL,NULL,NULL),(14,'user-2nQoDwOF','user-2nQoDwOF@test.com','$2a$10$i5zYdj/k9uHfQoKjJgDN4OGldeuufIStQ2/IP58vJy85JuZdN6qSi','native',NULL,NULL,NULL,NULL,NULL),(15,'user-ofKAN3Zy','user-ofKAN3Zy@test.com','$2a$10$amon.pljmpJ1LrGgUOUgVuy4c.YCK/.Q/XAU36KPaiNQKClI9L3Hq','native',NULL,NULL,NULL,NULL,NULL),(16,'user-LsiELhTH','user-LsiELhTH@test.com','$2a$10$6.Do6WEFJCx7DIFxIsUko.qoQqN2OqHypYGyWln9c6bdfYcGttW5.','native',NULL,NULL,NULL,NULL,NULL),(17,'user-hUoPcUNd','user-hUoPcUNd@test.com','$2a$10$rY/o6hfGEzE7Mky37TqHD.jcmjG72LYk6qbeZjQYHfm3spEfkXiXW','native',NULL,NULL,NULL,NULL,NULL),(18,'user-O2ywVXQA','user-O2ywVXQA@test.com','$2a$10$cpco/XWQzH6g6E6fOkb/H.WWp.rWfSon9tL41RqRjXswxLWr7jFBm','native',NULL,NULL,NULL,NULL,NULL),(19,'user-8rdTY23h','user-8rdTY23h@test.com','$2a$10$3f2Q6iWEK2Qdu4h2Z3uNhuezpBVryH402YC80wxXuxMeKvpDH9FVy','native',NULL,NULL,NULL,NULL,NULL),(20,'user-RlNzCDkB','user-RlNzCDkB@test.com','$2a$10$FPxvvREYWP/VWRk8.ju3Ounw85UfCTCMoZQFXFr4WOb3ixvFhuQNq','native',NULL,NULL,NULL,NULL,NULL),(21,'user-fBbMNkKY','user-fBbMNkKY@test.com','$2a$10$J8.zkaD5Jov7EdsObs0doOkjUSC6WmoRrvNRooCcJl8C/Abvcw0de','native',NULL,NULL,NULL,NULL,NULL),(22,'user-OrwZBPMv','user-OrwZBPMv@test.com','$2a$10$kA9MbIrnDfItqvNCG3qDzu2.b32VXBKhaWlPBiiVAD1bXddUcwsuW','native',NULL,NULL,NULL,NULL,NULL),(23,'user-FOTat3qY','user-FOTat3qY@test.com','$2a$10$2//WiUSqfWlOFx4BQDltxu0TyiOq8OFhLKOeFtPXk9tryg6LSALVy','native',NULL,NULL,NULL,NULL,NULL),(24,'user-6zJEjKiA','user-6zJEjKiA@test.com','$2a$10$F6Tnp8qmumwhqZkzEvkwVO5MBsDDnb95h8VFsAnyxxvE6zHjEvYCO','native',NULL,NULL,NULL,NULL,NULL),(25,'user-EyKxM5M9','user-EyKxM5M9@test.com','$2a$10$McJ.5hAXm.yZg795xucusOxipxwc8OUUzF.P5UMsLFKnzmIqCyDcS','native',NULL,NULL,NULL,NULL,NULL),(26,'user-pq0bDTc6','user-pq0bDTc6@test.com','$2a$10$6SUe2riC0bwo5QgWq8tOCepZ7sbdHGW4U3Yig3IfU24uwNZRREL7O','native',NULL,NULL,NULL,NULL,NULL),(27,'user-QsNzyFzp','user-QsNzyFzp@test.com','$2a$10$D60SU9lKcEKjvk1uCFWCR.bqEQelBHRLBj99hxkHdVmC2N.qeZgYC','native',NULL,NULL,NULL,NULL,NULL),(28,'user-ZtgTAUzJ','user-ZtgTAUzJ@test.com','$2a$10$ryaHmGO0hddVDKLuqvrVLeGBJD0p5ly42H.mpcYlsWyxS1jfV8wEu','native',NULL,NULL,NULL,NULL,NULL),(29,'user-Ox8IR0zQ','user-Ox8IR0zQ@test.com','$2a$10$Fb/79wQM16TsIs3YPHeTI.JF8xaIerf9U3c2lEPqJPuGbpDnU26Em','native',NULL,NULL,NULL,NULL,NULL),(30,'user-Jk3oHwNc','user-Jk3oHwNc2@test.com','$2a$10$i3e0cKs/qd5/SsVIz5oRaugUmiDcYh/cERfy50hNxDX8/piRdNYKK','native',NULL,NULL,NULL,NULL,NULL),(31,'user-rsTuhh2v','user-rsTuhh2v@test.com','$2a$10$Rf/KwTtGZorIScvqYTJVX.wxeKypxpM16AQc9OnhpBCy1GZmhbpTu','native',NULL,NULL,NULL,NULL,NULL),(32,'user-vly6aSpw','user-vly6aSpw@test.com','$2a$10$R1.BqHfC43d6Cjzv5xc9aOGNpjnqEZCv2Wg3dfxtR6GXiPU2RxlGq','native',NULL,NULL,NULL,NULL,NULL),(33,'user-ofZ4ahjs','user-ofZ4ahjs@test.com','$2a$10$535f6rX4vnIvTJDzl.nVGOVqklL9dv03ZICc3jUphPvMVRkiUkCwe','native',NULL,NULL,NULL,NULL,NULL),(34,'user-IipYl2CF','user-IipYl2CF@test.com','$2a$10$Yv93xCIHDCv9aYs7CT2KiOscGibLr34bM0wqj55IoFOBiUNVcpW7O','native',NULL,NULL,NULL,NULL,NULL),(35,'user-96kMaoCf','user-96kMaoCf@test.com','$2a$10$Qlm0Im97g/7rXBpZXaBjSu61PG80xkYtoQnqfVhysRA85kpdvdQ5m','native',NULL,NULL,NULL,NULL,NULL),(36,'user-kkPb3TR5','user-kkPb3TR5@test.com','$2a$10$wGnR.iY21/L3pwfPswqYWOGMX9qUTeA6jxa6pGvnEzFTkAEvq6Ek.','native',NULL,NULL,NULL,NULL,NULL),(37,'user-dfnfKjPI','user-dfnfKjPI@test.com','$2a$10$uPRXFWit1/v14Ixmw5V9NOr9dTgjb4s0ERDs3b1VEINL8NL0RN0AC','native',NULL,NULL,NULL,NULL,NULL),(38,'user-0uyT6qti','user-0uyT6qti@test.com','$2a$10$0kPUFciVZ1H4Iujuld2RK.VyOa7WYTxZdkA/YeMmMlBL/22Yiaa6e','native',NULL,NULL,NULL,NULL,NULL),(39,'user-kzZmfslf','user-kzZmfslf@test.com','$2a$10$yFq/h3vGORtuClgGNE94SeY3edJEQy2ajnxFAEk2xFZRKV6zYw8G6','native',NULL,NULL,NULL,NULL,NULL),(40,'user-7eAlODhH','user-7eAlODhH@test.com','$2a$10$.k4Dy7TKVlY9us49CtjtFeaYfglEGHthkWGXXPAzpmvkjFOapiJtK','native',NULL,NULL,NULL,NULL,NULL),(41,'user-uYM7hw6n','user-uYM7hw6n@test.com','$2a$10$hDhkvWHabLcBqgEZnkKRse9ZkY68fNOEkwB9PVXUN8cheM03L7kiu','native',NULL,NULL,NULL,NULL,NULL),(42,'user-kOselAHo','user-kOselAHo@test.com','$2a$10$LMddCf/dXEH8KsjMSNbUGu.QokOE3kbu/H0sLo/awiBZuoLYfYjoe','native',NULL,NULL,NULL,NULL,NULL),(43,'user-RU0ql3Ul','user-RU0ql3Ul@test.com','$2a$10$v3f5ax/SbZfzk4cD0IgWXOV5L7bS7TK33GutzAxqGg0Nx0EPw/Boi','native',NULL,NULL,NULL,NULL,NULL),(44,'user-jIElC28p','user-jIElC28p@test.com','$2a$10$RkkBNa7UYqcRpc//k7bK.ugzYtIJGHVZALLYf13inIal9Mtg1Xfmq','native',NULL,NULL,NULL,NULL,NULL),(45,'user-RsnNnPCT','user-RsnNnPCT@test.com','$2a$10$t0tzUhHmhGbx/NKwYu8v/.cLKpYkirbeYvGb3SBseoU3iF6BzY2MC','native',NULL,NULL,NULL,NULL,NULL),(46,'user-o2DZApLE','user-o2DZApLE@test.com','$2a$10$eG51JfDFeXgLfPfMszd93.YIDgJfRVqcse0X9vMap1hzyCUwA92qu','native',NULL,NULL,NULL,NULL,NULL),(47,'user-KkbAYD9x','user-KkbAYD9x@test.com','$2a$10$Iuom.kuGQulZOVxEbKp08.49GTtLy4rUTs3DoRkeaopDwEBI.GFE6','native',NULL,NULL,NULL,NULL,NULL),(48,'user-O87crwcN','user-O87crwcN@test.com','$2a$10$NqZXU9D0bvm3kZ0h9YMmfOIo16f52i/QqdNmq1UOHdNhJIfB16AUW','native',NULL,NULL,NULL,NULL,NULL),(49,'user-M2awzm94','user-M2awzm94@test.com','$2a$10$KtkNDk.SydUH3qZpoRo8DOXOZjtF6ssEaA4FRIsy6JSZ2RAi.1oU.','native',NULL,NULL,NULL,NULL,NULL),(50,'user-w89qKW23','user-w89qKW23@test.com','$2a$10$bLANGcBr4sK7cVIJrlZZC.4j3u6W10.vRRyD4vtPRD8qXcUq61M4a','native',NULL,NULL,NULL,NULL,NULL),(51,'user-xapKRbB7','user-xapKRbB7@test.com','$2a$10$QOyOzQ9efFSPWN3sC6bkmOfjQFOOvS8b0Uzn0MHO6TXPBSY.I8oqW','native',NULL,NULL,NULL,NULL,NULL),(52,'user-7kqlc0T8','user-7kqlc0T8@test.com','$2a$10$TcfdR.8qt5EV6eDiqKVN9u7aoQZntRXivfL5CcEkyH6GXWAcN1dC6','native',NULL,NULL,NULL,NULL,NULL),(53,'user-f65N4MIn','user-f65N4MIn@test.com','$2a$10$.6vByXCEwSSf.sWD2L.WgOAvp274ErdUaGvIqRgrGhcYWZC6zMo6y','native',NULL,NULL,NULL,NULL,NULL),(54,'user-qfoTY7Zf','user-qfoTY7Zf@test.com','$2a$10$aslJ6J9KSpIgHqCwRC1e6.T6ismW/hBDxdwZEBE/3v84r2wXTWgrC','native',NULL,NULL,NULL,NULL,NULL),(55,'user-9kfZ7WGI','user-9kfZ7WGI@test.com','$2a$10$9UV8RZ18lFlGvTXb/g27Jea1VkEsx93KUsn/ex0Y6MjlMsX9qnnB2','native',NULL,NULL,NULL,NULL,NULL),(56,'user-tl5WePoF','user-tl5WePoF@test.com','$2a$10$6yg09uSd0PAqKdfvbtugm.j3oT5WYNWEDh2uJZ7MCziZ3NS76JGQi','native',NULL,NULL,NULL,NULL,NULL),(57,'user-C2P2oSpK','user-C2P2oSpK@test.com','$2a$10$S4hjNIo2xr0T0dVn6G9E1uyLS.EV48KMRhw6pNLT1bXkX65i5RWxO','native',NULL,NULL,NULL,NULL,NULL),(58,'user-x39X5YdM','user-x39X5YdM@test.com','$2a$10$Lye4hBEeoGb756SmZml08.KHxzOAsbHvswdg89uijxdea1Mxoxlbi','native',NULL,NULL,NULL,NULL,NULL),(59,'user-8LS3Gr8k','user-8LS3Gr8k@test.com','$2a$10$.DjP6LbwrmpZy8d3IrXJ2eNap/p7EOfsEM9TRb4k5COiyMaPiBrV6','native',NULL,NULL,NULL,NULL,NULL),(60,'user-i3qtyY3y','user-i3qtyY3y@test.com','$2a$10$Vo7Ep27ZG.L4olQ43PIXkuCgcPEM5tm6stlToudOzUmpGlLOrn9.K','native',NULL,NULL,NULL,NULL,NULL),(61,'user-nISXA9Pe','user-nISXA9Pe@test.com','$2a$10$JZWeYgmQp2A9592WEhAmfu.9Dbvq2roBEGADhiUpDLZbneZBON0Ye','native',NULL,NULL,NULL,NULL,NULL),(62,'user-coJ068Pp','user-coJ068Pp@test.com','$2a$10$CBVEuNbGQfIVcD8WW3WROuQw5Zc7WE5jissaczBN7jcjUz/DVPyf.','native',NULL,NULL,NULL,NULL,NULL),(63,'user-QigWSXVp','user-QigWSXVp@test.com','$2a$10$oy1ZmOzAV8D6an3fXZUDAuKM9pcGm/KafvWA33D5CTI1rzTmMCtIq','native',NULL,NULL,NULL,NULL,NULL),(64,'user-06adnVR8','user-06adnVR8@test.com','$2a$10$SyBMvLTOcTkkxRvsndG3Q.F1HH6jM4XfNsz1no5qp6P95V1IO9iG.','native',NULL,NULL,NULL,NULL,NULL),(65,'user-7cGcDt2U','user-7cGcDt2U@test.com','$2a$10$8BnmRd5M301w0zhB1nObfeW491/5/EXh5vy0BOCrVhh/hwHcTfPz2','native',NULL,NULL,NULL,NULL,NULL),(66,'user-JQQBZs0p','user-JQQBZs0p@test.com','$2a$10$aW6HArf8KB2jKtGndna8uehn9viK2nhr3NOMucj1T.KjjImJZyfwm','native',NULL,NULL,NULL,NULL,NULL),(67,'user-CPgES6fA','user-CPgES6fA@test.com','$2a$10$hss1Nwm.zDhHKU.ka//wru9rMEHgpqL32KzEXl9BG7YEFeMog84um','native',NULL,NULL,NULL,NULL,NULL),(68,'user-ExoX0VAT','user-ExoX0VAT@test.com','$2a$10$vHV3HpT94zD2JvuYzRQl.OwNOCNyt7A1KWZ.Zj8iY0wEt7a3EaMta','native',NULL,NULL,NULL,NULL,NULL),(69,'user-7BbbfTHQ','user-7BbbfTHQ@test.com','$2a$10$QbRlx9CKKockShl8kJ/zceG89T2nbfIgvrJKShLEIYF4r305pY8xK','native',NULL,NULL,NULL,NULL,NULL),(70,'user-TjHfjz7B','user-TjHfjz7B@test.com','$2a$10$90YmF8xcpyYmGt56BzZGruGXZy102SK1aPfrxb08zMn2oR7jbyQ4e','native',NULL,NULL,NULL,NULL,NULL),(71,'user-BkoJQtEN','user-BkoJQtEN@test.com','$2a$10$Ny4YY5Jw9BWs4eEqbtUv0usjwWEn2umrnhxwLFawekE6aDlxYtglm','native',NULL,NULL,NULL,NULL,NULL),(72,'user-frq9ciNi','user-frq9ciNi@test.com','$2a$10$zkRC1xtqGFvAnfoxkwRCTOK9.PSiMXyngPQxCEr.sFquEl6QTsy8m','native',NULL,NULL,NULL,NULL,NULL),(73,'user-38V4GvGO','user-38V4GvGO@test.com','$2a$10$eyFpF5skQ8MW.Wb8.ajFDuyClsFNsUqrF9OUoeyBJdcSYCnj3R74K','native',NULL,NULL,NULL,NULL,NULL),(74,'user-h7NFHYk2','user-h7NFHYk2@test.com','$2a$10$gLFgxQUY7xOCMdkR9AJgIu3gCtOt3TJXoqtjD1aSEOEg.TyDs5EBS','native',NULL,NULL,NULL,NULL,NULL),(75,'user-iizctJNk','user-iizctJNk@test.com','$2a$10$pM7YG5yScNSnwhiMRjbETubx41BEotEE69vyeLxWlnsgp.YFoKkDy','native',NULL,NULL,NULL,NULL,NULL),(76,'user-QncsIdLd','user-QncsIdLd@test.com','$2a$10$GYcDetpAjZ5GA9sW1MczsuOCtOdBVz9V1d7C5PXArAnyQEtfW3Hvq','native',NULL,NULL,NULL,NULL,NULL),(77,'user-laSyJgFI','user-laSyJgFI@test.com','$2a$10$lBtD9ZgP58rw3X3u6docne/0Ru/HEhKldM1BeVpu6a9.EAkvQce.O','native',NULL,NULL,NULL,NULL,NULL),(78,'user-ciGKAaB3','user-ciGKAaB3@test.com','$2a$10$uGot9hi4RU6SKzdkuWA8gui1I9mLh2cI.KgkrgFco0Klk1TeRBfGW','native',NULL,NULL,NULL,NULL,NULL),(79,'user-eara8qNG','user-eara8qNG@test.com','$2a$10$K3vxucfkr0L7hdze4dHfb.pp9p2mJZ7o4W.XXoGbmI2mbgkFm5ZVe','native',NULL,NULL,NULL,NULL,NULL),(80,'user-C0ADpJAy','user-C0ADpJAy@test.com','$2a$10$77iuo3C7c7E9h4ni/nckQuSbEOImP2pxuslDlE9q7JLLdGrIOVl0O','native',NULL,NULL,NULL,NULL,NULL),(81,'user-32FBPkGB','user-32FBPkGB@test.com','$2a$10$C.fL5/Dz2HvgUd57HSoZ3.sM3jQ5.2CyJdKD16sqz/5VGLZpMCrZS','native',NULL,NULL,NULL,NULL,NULL),(82,'user-DRhETaxH','user-DRhETaxH@test.com','$2a$10$hMEQWXw99JggSvndGlEnmeM/srgKuS4olmOcmdom9ophzPPo1P7hy','native',NULL,NULL,NULL,NULL,NULL),(83,'user-7IdKPV2K','user-7IdKPV2K@test.com','$2a$10$SH8KlLnNxi8.qInCrWMz3eit0PtZivdNngR7.I4FD94kXTdnh5dEu','native',NULL,NULL,NULL,NULL,NULL),(84,'user-IotzlenR','user-IotzlenR@test.com','$2a$10$D4cWWwRGMfJA76H8wfeVwui6MDjgCjTnqAK1CDjOFUBAvb/JVjHKK','native',NULL,NULL,NULL,NULL,NULL),(85,'user-MoQ0oyd9','user-MoQ0oyd9@test.com','$2a$10$vzQVrlrgMeLZqt3AVfW1qOwDXVoH8i8VWvyr92pWWXc/Y6tSi5hse','native',NULL,NULL,NULL,NULL,NULL),(86,'user-Db03Lq5d','user-Db03Lq5d@test.com','$2a$10$euxm5zMhDmR9lZhMqa3AW.IiAXNgrxisGeD4Myfs497JXZLnV3ucS','native',NULL,NULL,NULL,NULL,NULL),(87,'user-qxprJYRu','user-qxprJYRu@test.com','$2a$10$cds2gc3E1urN/swJgrHEgeSUs8BJOXtXdGQtFYuJbuYKUVBpqNE46','native',NULL,NULL,NULL,NULL,NULL),(88,'user-tGxw1gcY','user-tGxw1gcY@test.com','$2a$10$lKToeqD32YOlgpGyZtbJjei4RsZL8Mzi2Qoo6s4I3jE0a51eYLiWO','native',NULL,NULL,NULL,NULL,NULL),(89,'user-kzeoTelS','user-kzeoTelS@test.com','$2a$10$b4309ozEXLwr0OGbVcryv.jti2FIG8b5R.izc.NT7VMubJHcDtjhy','native',NULL,NULL,NULL,NULL,NULL),(90,'user-0HG9CDVQ','user-0HG9CDVQ@test.com','$2a$10$Y1Qt.QZERYniZ3gCDwUHUuY39I9BPOt8h7MNiP5/0zH4/3eqBopke','native',NULL,NULL,NULL,NULL,NULL),(91,'user-vdFI2OsI','user-vdFI2OsI@test.com','$2a$10$9OA4L0SkFu5ya.dAyXf2W.Ac2A.4SvROoJAycR.71.23IHWTsakLm','native',NULL,NULL,NULL,NULL,NULL),(92,'user-0kdeVoaT','user-0kdeVoaT@test.com','$2a$10$ks.9qoeJfdjqEG5HlSMjoO0ZmJBITN.bm5vO9NteXA5vviqF69VLy','native',NULL,NULL,NULL,NULL,NULL),(93,'user-KRNY9Mai','user-KRNY9Mai@test.com','$2a$10$jOagb1FYiPyqcLOV2pUlZOjNB4DgzPJ4eJ7BYKaPKYDOwyX1dkDrG','native',NULL,NULL,NULL,NULL,NULL),(94,'user-FJgfUBim','user-FJgfUBim@test.com','$2a$10$r8f28O.FsVsBJMaKuxB2IO/ni0Z/h04nQ.3dC/1b0A.v3m.gySL2S','native',NULL,NULL,NULL,NULL,NULL),(95,'user-f7Nf3FcX','user-f7Nf3FcX@test.com','$2a$10$F2jnNyQBJWgRoOrpTdIJk.4uoNu7rRQkVaa8yo43k5JW5zwoVbA1u','native',NULL,NULL,NULL,NULL,NULL),(96,'user-9hSmZTJz','user-9hSmZTJz@test.com','$2a$10$UHMGMDzMuZDm4Qypz5FZSuBbp.0uOc0crWXDq3WNaj6w20tqEEdk2','native',NULL,NULL,NULL,NULL,NULL),(97,'user-12vyXQCJ','user-12vyXQCJ@test.com','$2a$10$Sd1V4UIghnAph7uJ/wmLHOYtTHNBG4J3/KPIl6EHXgd0HnN.BTZJi','native',NULL,NULL,NULL,NULL,NULL),(98,'user-a4Y2rcNc','user-a4Y2rcNc@test.com','$2a$10$KWg9jhVO4X9ijP2rhxP48.xaQ2AG9LBQLiTgzdQQkjK5PmSJTTsJW','native',NULL,NULL,NULL,NULL,NULL),(99,'user-bJ9R5nkT','user-bJ9R5nkT@test.com','$2a$10$OyOqFi3fLDEBss/AMSjBAOPGLOeOVsN2hN8.h4Eb8RMp8SMOpqzCa','native',NULL,NULL,NULL,NULL,NULL),(100,'user-gcyhwanl','user-gcyhwanl@test.com','$2a$10$8lx1BJEgSRmPzL7jvFR9wes0HalwifMufRdJe/yXkaPwGXqfKy8vm','native',NULL,NULL,NULL,NULL,NULL),(101,'user-a5YK0K8i','user-a5YK0K8i@test.com','$2a$10$EkAP8f2HAjUwAOBmO7nyvea5MXp7Jm6NEqFoCV8BPC9kfZ8eyhbZC','native',NULL,NULL,NULL,NULL,NULL),(102,'user-sef56vqu','user-sef56vqu@test.com','$2a$10$C8NOcVZcbji/vZPX1QorN.V2m8/MSXQNWqlsOnpyuQtqsh/yhi2fi','native',NULL,NULL,NULL,NULL,NULL),(103,'user-yRbC3WCk','user-yRbC3WCk@test.com','$2a$10$ERk.KcZDJ3Al0nY5cVFUXuig4Yy/vOLuuy.v4ghOrlIJ5DAE5wSPC','native',NULL,NULL,NULL,NULL,NULL),(104,'user-wDRaXe4v','user-wDRaXe4v@test.com','$2a$10$dNmwn5C2m3GSzAsoOTmneO6u5knqMJTBjDBxaFyj/4zK9mZ74rCK2','native',NULL,NULL,NULL,NULL,NULL),(105,'user-qw9h8nJs','user-qw9h8nJs@test.com','$2a$10$lX9QIZ.GJFvuR70wBtVYk.x3YvYeyw4EUhqo2pMUlMW.7V.dKDJ9K','native',NULL,NULL,NULL,NULL,NULL),(106,'user-y2tmmpJ8','user-y2tmmpJ8@test.com','$2a$10$h6rz7oea.AEUiT8/9XaFGOuWpdhwG.S/I/jGFRPx8ziG0DHK8Co0y','native',NULL,NULL,NULL,NULL,NULL),(107,'user-zw6iPWOm','user-zw6iPWOm@test.com','$2a$10$ifYwx/wQMQV9oum54dZ6o.h7aECTeDciy2z.SxigdT14eLmQ2teoy','native',NULL,NULL,NULL,NULL,NULL),(108,'user-SlS7FaCH','user-SlS7FaCH@test.com','$2a$10$Mp8y/P3qdzQjK.d3kL1MiOgdHwQxf/UfXgV.UhTmHNLMq6ATk.26O','native',NULL,NULL,NULL,NULL,NULL),(109,'user-rT4aeTRo','user-rT4aeTRo@test.com','$2a$10$3ShgSJSniVUcdSMdzYjhpumcJq2ZH5xdbufUhJHXgk4IAmGodRgmO','native',NULL,NULL,NULL,NULL,NULL),(110,'user-048bNSwR','user-048bNSwR@test.com','$2a$10$26NXmfHgBfVXY/WAHI9FCOP8PeoG6pMfyrsWZqe2thgVcDkZGo0dG','native',NULL,NULL,NULL,NULL,NULL),(111,'user-J1NFNKrG','user-J1NFNKrG@test.com','$2a$10$7WkJRJeba4xwmMJNeQYPW.ZOJp304TGZ1b7FgYLFWixJssh28Zffy','native',NULL,NULL,NULL,NULL,NULL),(112,'user-e0Kc68zF','user-e0Kc68zF@test.com','$2a$10$eDJ.bQwHsYpAjYYZRwB0eeKD/JFHr12VVnI.BKv/L9LQCaXRkYI5a','native',NULL,NULL,NULL,NULL,NULL),(113,'native','p@gmail.com','$2a$10$mb5dZkIjtYTvHaImBqsw4eUxkn7KIUKdj4dRgLgV2Zbi.JCHAt1TC','native',NULL,NULL,NULL,NULL,NULL),(114,'native','pttttt@gmail.com','$2a$10$GziZycJtM0grf7WDnVaY2uxQ1iTt7rMOjfS6rK4777Rvsx6gKyyQ6','native',NULL,NULL,NULL,NULL,NULL),(115,'user-dw9pY1iu','user-dw9pY1iu@test.com','$2a$10$kgZeRMY9d3j1jE5RGoRaFepQW68ekhKuaWNrShpXScE1Xt6tbmXG.','native',NULL,NULL,NULL,NULL,NULL),(116,'user-KE4F9D0e','user-KE4F9D0e@test.com','$2a$10$W1Gcq0jx4TNqOJhbqjgS3usZbE.5N4PQnkGrDwxym1NNjBGtBTy0e','native',NULL,NULL,NULL,NULL,NULL),(117,'user-CcMeem0w','user-CcMeem0w@test.com','$2a$10$yQnZLuxhhXSTVvbPLiQsAei1kB2ZfIk1b4j.sUP2dt3UwWP5Em2Xu','native',NULL,NULL,NULL,NULL,NULL),(118,'user-R0EyxxMv','user-R0EyxxMv@test.com','$2a$10$H62.CVi314ddauhCv544ROykiBbHZsoW36B6SEgp.oNCO9J/nvNO.','native',NULL,NULL,NULL,NULL,NULL),(119,'user-5uuvaLyx','user-5uuvaLyx@test.com','$2a$10$zoSN0nn7TiUBmPG22D2qouSl6LtxuLVdz4N27foq16XXAqwCFZDU6','native',NULL,NULL,NULL,NULL,NULL),(120,'user-cNgSG8N1','user-cNgSG8N1@test.com','$2a$10$QIKSnnJfamn9ujfcG4lNlesiBKnzqs2hJYkzy6eVGfYNDHm98RFj2','native',NULL,NULL,NULL,NULL,NULL),(121,'user-XXcr31b6','user-XXcr31b6@test.com','$2a$10$XnarTBrpioNx3hkWSWrh8ua6MD87VuySQ0IRPVePCUPHUX9UjIYhO','native',NULL,NULL,NULL,NULL,NULL),(122,'user-PzEHHfxx','user-PzEHHfxx@test.com','$2a$10$ix7bJxDz1HVysqZwCRW.xOKaDCpgEas6JHwKgmWtNUHYQhbFJcx06','native',NULL,NULL,NULL,NULL,NULL),(123,'user-AkqaFNpv','user-AkqaFNpv@test.com','$2a$10$7B2.PMojFa3.ULYTaEOTMeT.vd9y74v6/6ctVICXSGHPUe1eOPDWK','native',NULL,NULL,NULL,NULL,NULL),(124,'user-XBsCVVGq','user-XBsCVVGq@test.com','$2a$10$TD6UlscekwbRzRgq7VH9W.Hs7lz1yYM.AWtZt6ll8GepVlRuBV.Ze','native',NULL,NULL,NULL,NULL,NULL),(125,'user-tpHUxIZx','user-tpHUxIZx@test.com','$2a$10$l4fGv3GK53WnAvgC8U5FkuP7hf2XOt.v0DyvN3YpyNGw7hdMfkPBW','native',NULL,NULL,NULL,NULL,NULL),(126,'user-8QKmUqLe','user-8QKmUqLe@test.com','$2a$10$zu84GoZ2P5QvGtHmtoSSIOgekMtkoq5XOPWt71kYY8P4AaxlLx5YC','native',NULL,NULL,NULL,NULL,NULL),(127,'user-EhgRMwrH','user-EhgRMwrH@test.com','$2a$10$.5hQLewVMWHj.apEXWzcF.rrVGomZtIOe5dCtk5U7gV.giovC/INu','native',NULL,NULL,NULL,NULL,NULL),(128,'user-RzWJ6per','user-RzWJ6per@test.com','$2a$10$zPtc0gWSBz53BRPmVInNvOsFt5L1bbSzFZsLEXI09pHCqRsNItwPO','native',NULL,NULL,NULL,NULL,NULL),(129,'user-d05sBNLr','user-d05sBNLr@test.com','$2a$10$NXyjptV7mJLbAWO9fFfhdefY/pznZ/Axw3LaC48Jtmv46Xg.EiqJu','native',NULL,NULL,NULL,NULL,NULL),(130,'user-1jCpZgmJ','user-1jCpZgmJ@test.com','$2a$10$H/FnKK18vQ1CDfShvlAR..8REBTk3l59UxIBtR96iZFI41UVEewsO','native',NULL,NULL,NULL,NULL,NULL),(131,'user-SknmTeip','user-SknmTeip@test.com','$2a$10$r7fQA6kZo9WIpca9sdqAJOUPGjn2sd4u2LlUlTA7XVUvGNqjfKvlm','native',NULL,NULL,NULL,NULL,NULL),(132,'user-NHJkXX2V','user-NHJkXX2V@test.com','$2a$10$tl5BkbV5Bimf5dTVU6.XVeC8oyHFl0xdN/UTbKrFbCCQnMNKNfTp2','native',NULL,NULL,NULL,NULL,NULL),(133,'user-xj0iSUnk','user-xj0iSUnk@test.com','$2a$10$ug6ArGDlfLWMhVYUzHupueW50XjUYnH958STNMkvPJerDPjgMXm2m','native',NULL,NULL,NULL,NULL,NULL),(134,'user-O3z7AJu3','user-O3z7AJu3@test.com','$2a$10$RZTgVacZBFcKd.Xpy9uiV.RNNbG.zQgCr/LZ2ColZ3Or9cn.vxg26','native',NULL,NULL,NULL,NULL,NULL),(135,'user-m1C5ZiCB','user-m1C5ZiCB@test.com','$2a$10$COMkAzI6A3APa/fzXWUxsuTvyHZaLm1ST/ci8thMu/FTUk0K2z6EO','native',NULL,NULL,NULL,NULL,NULL),(136,'user-15A6MqAO','user-15A6MqAO@test.com','$2a$10$Tm075R4uFPQINS2nDrmpe.vQJch9pH5pHwdarwFpPuGGLrvhQdtte','native',NULL,NULL,NULL,NULL,NULL),(137,'user-afyuWj88','user-afyuWj88@test.com','$2a$10$xpn.WwOAVncSvnhbxorPuOcIl9J1Kjg5sTCLRCkgczeLWzpNmdueq','native',NULL,NULL,NULL,NULL,NULL),(138,'user-JbWZgPcE','user-JbWZgPcE@test.com','$2a$10$ht4AqdRFnSoSSH52IB1boeNRa0BXeQbvGxqg/AOjxBCR935.7R1SK','native',NULL,NULL,NULL,NULL,NULL),(139,'user-U2yPFZNi','user-U2yPFZNi@test.com','$2a$10$2dz0lXRHqBSjycj3fGKTrO/1waUMPnnCuw5UrJ.PRU.yA/lF2FC7C','native',NULL,NULL,NULL,NULL,NULL),(140,'user-wjxECcMX','user-wjxECcMX@test.com','$2a$10$CVUcvkilQUPMSpzt3.qAc.H/fYjcahxYcrIRvJ9Y6NOuoQp64AyhG','native',NULL,NULL,NULL,NULL,NULL),(141,'user-yYYEcgBH','user-yYYEcgBH@test.com','$2a$10$exLqqMDUh2Bj7Q5V9zESZeHYEJXCXcWqaTZGmgBhPDSMQ8iKUdqci','native',NULL,NULL,NULL,NULL,NULL),(142,'user-8KdBqGtW','user-8KdBqGtW@test.com','$2a$10$0lDVByK4bFltvp2vMDhrpOrgtpShOszUc..eNzEZP6CWPk73Qje7C','native',NULL,NULL,NULL,NULL,NULL),(143,'user-5B0Uolh3','user-5B0Uolh3@test.com','$2a$10$1xynAHy3F50MdKHqQfByT.qWi9G8R00mqQBHKYcxpER0VsIVCz1Qe','native',NULL,NULL,NULL,NULL,NULL),(144,'user-oo1dOb3R','user-oo1dOb3R@test.com','$2a$10$O.b4y59438J.MfoIOzmBFeXJRuG4cjEY7VVhTAbEOQKbHhabDn0su','native',NULL,NULL,NULL,NULL,NULL),(145,'user-Qk6RQA5t','user-Qk6RQA5t@test.com','$2a$10$Tj.yllWKM3fXJins9zCaMuGnsF2Z391A89FGxu9JdJ6WLfpI2R1TO','native',NULL,NULL,NULL,NULL,NULL),(146,'user-gkR11Tqj','user-gkR11Tqj@test.com','$2a$10$aNj.X5gUwWJWp4M5dYQXcu1QQQ6EIlYxuFSarDNkhNRyqC2LByBya','native',NULL,NULL,NULL,NULL,NULL),(147,'user-9Z9QwQsu','user-9Z9QwQsu@test.com','$2a$10$MN/gXjyQULSZJpoK6wJHhOD6KXs.HcCMD9C8DRMUv18bVsx1DV82G','native',NULL,NULL,NULL,NULL,NULL),(148,'user-udMBkCgU','user-udMBkCgU@test.com','$2a$10$Mc72GESeYxomWE3too6bUOKJgi0MjnS19QsSVRUqCz6If8TNjrHvK','native',NULL,NULL,NULL,NULL,NULL),(149,'user-Da7j6DxK','user-Da7j6DxK@test.com','$2a$10$bYYUlFL6bFKn.4FJy3K0we8HaFvQQ1P9G/EOZISQ5N25225WCf4Ei','native',NULL,NULL,NULL,NULL,NULL),(150,'user-0lGzd6R7','user-0lGzd6R7@test.com','$2a$10$yY.TXLAoooMKAaZlv1mm5.MpaEj9zLGDHmRbIsTxoCWc8CxYRZgju','native',NULL,NULL,NULL,NULL,NULL),(151,'user-jzYpIq6M','user-jzYpIq6M@test.com','$2a$10$o4Ys35hm/xhFO.Eu46sdb.jKOVfCU/fJJMfX4esu4eGYLeDOU8cdW','native',NULL,NULL,NULL,NULL,NULL),(152,'user-Gnb6fmw7','user-Gnb6fmw7@test.com','$2a$10$tvqaURwCZOc5DXNpmIBcLuB5Z.XKkoK/7BKRqP02MsJ4mrK5xIr1m','native',NULL,NULL,NULL,NULL,NULL),(153,'user-iGgFvVMI','user-iGgFvVMI@test.com','$2a$10$NvFw6wafylzdVFrVKbwZo.iN2BCz2T.AcF0yfnWGrhZYN.aQXTxBy','native',NULL,NULL,'我超帥','睡覺',NULL),(154,'pt','pt@gmail.com','$2a$10$yFJL85qCYZQDparihnDHte2GV4TeNp4ibhhTJPUnxfiHx.2688.8G','native','public/pictures/1689690393714-69333.jpg',NULL,NULL,NULL,NULL),(155,'test1','test1@gmail.com','$2a$10$80iqUNoKIzVHns9V1/0n5uU7IzMredkoIP5R4k//eWipTLe28gMiO','native','https://13.211.10.154/pictures/1689692416983-25182.jpg',NULL,NULL,NULL,NULL),(156,'duck','duck@gmail.com','$2a$10$qg4wsucGZnwDQlDi6SPo2OhZWKo1/y5yutLzioNe6M.h.fOdIZDyK','native','https://13.211.10.154/pictures/1689734183191-4085.jpg',NULL,'quack','quack quack',NULL),(157,'Penguin','penguin@gmail.com','$2a$10$W8btgQj5ijgRN5ik.MXaq.KRAHCLTv9yXDDR5nXduZ3nCSprDbHA6','native','https://13.211.10.154/pictures/1689734496003-93515.jpeg',NULL,'','2',NULL),(159,'Capybara','capybara@gmail.com','$2a$10$geKh4RM5m.Z5XXToA6M11ugGkKfGH.VGHIC6EPCL0ZoS6LqFtpd7u','native','https://13.211.10.154/pictures/1689747634008-11216.jpg',NULL,NULL,NULL,NULL),(160,'raccoon','raccoon@gmail.com','$2a$10$51uXcklNFW03VmnNyOWFJ.qAow2apnsHIN3KBqoRxt9.fLQKCaSOe','native','https://13.211.10.154/pictures/1689748064919-47643.jpg',NULL,NULL,NULL,NULL),(161,'cat','cat@gmail.com','$2a$10$nyFuzmvjTL1QdR5qX5VzN.BHDM876bygtDF1OjD3TymWgCf0IbE46','native','https://13.211.10.154/pictures/1689748460352-24273.jpg',NULL,NULL,NULL,NULL),(162,'Dog','dog@gmail.com','$2a$10$JtL9B8wcpa/8DuEOqLZNb.EawiOwM34o65BSOSluQrBV2YqrfdZ7C','native',NULL,NULL,NULL,NULL,NULL),(163,'fox','fox@gmail.com','$2a$10$HsOWmy1ct.LpaWx2nkQFK.lGQpa8DpcSIHy5/syjYJ4bL.gJLgeX2','native','https://13.211.10.154/pictures/1689748671924-96072.jpg',NULL,NULL,NULL,NULL),(164,'Shark','shark@gmail.com','$2a$10$W8/MADlw5DISvmGKbaf1GORRs0JNWo7c/ze8cDXgDCvrKWcKK41qK','native','https://13.211.10.154/pictures/1689748761845-4034.jpg',NULL,NULL,NULL,NULL),(165,'Rabbit','rabbit','$2a$10$UZfTVtDrTMc3CmkgcAYjqeiEDUafOdXLaAvjFTWgljxghKjAUo72i','native',NULL,NULL,NULL,NULL,NULL),(166,'Orca','orca@gmail.com','$2a$10$uvfXtyE7tLQDGu3qaoy6OeyulFObVc4XwQiQdDBEajpv7Q2XyzFSG','native','https://13.211.10.154/pictures/1689749020781-10032.jpg',NULL,'虎鯨','哈哈',NULL),(167,'Jellyfish','jellyfish@gmail.com','$2a$10$NoCj1MtCsZeyt.cVPdyg/eyB9vBKFRVcgIZY9NTkgpl4mYwhmZvLW','native','https://13.211.10.154/pictures/1689749148395-61327.jpg',NULL,NULL,NULL,NULL),(168,'pj','pj@gmail.com','$2a$10$dLa/kxvXOCR0zlR1JW798emn9w/pPVv.C7lPT4EmlWSy9buhuS0Le','native','https://13.211.10.154/pictures/1689835133125-8061.png',NULL,'213','456',NULL),(169,'pj2','pj2@gmail.com','$2a$10$X6eczJTtVEV38HHtpM8QT.mxULzw2ObQedCnXEnah9cWmL0QSvu3m','native',NULL,NULL,NULL,NULL,NULL),(170,'user1','user1@gmail.com','$2a$10$uZpBdPLX3r5yRsmtWuAR9OwMxOfKKfgQqbXlInHQFFwyJPs6TXNZ.','native',NULL,NULL,NULL,NULL,NULL),(171,'user2','user2@gmail.com','$2a$10$GZLvv.6oeM/Pf5o5MDIGXuGRJ35IxnH1pjhy1dYSZltWuFsPTGtj2','native',NULL,NULL,NULL,NULL,NULL),(172,'user3','user3@gmail.com','$2a$10$1aMNhDX5b94cT4noAzZyBOG9rU0.a99RqKqaZiukCpBAyaPu6WR26','native',NULL,NULL,NULL,NULL,NULL),(173,'user4','user4@gmail.com','$2a$10$pwlm8.PWNHgbjrJL7YsWaeiIge9q9zAXsoe2QzfzlASgsVkscWtu.','native',NULL,NULL,NULL,NULL,NULL),(174,'user5','user5@gmail.com','$2a$10$sSRMhObYpCxpLpq35hfma.N8ydRPsWzg6x2I9Cfm1V8qwZApYrsjG','native',NULL,NULL,NULL,NULL,NULL),(175,'a1234567','a1234567@gmail.com','$2a$10$aFhYvdsS0GMltSqIM5aGpu3.I7vxWxj.34K1U4nLjQOuAalu/o082','native',NULL,NULL,NULL,NULL,NULL),(176,'user6','user6@gmail.com','$2a$10$Vg70IR0tNut67vt/sl8iZ.pTfEIuxkH77CjToZgLGii.VKBtXFQ5m','native',NULL,NULL,NULL,NULL,NULL),(177,'pj-midterm-3002df39','pj-midterm-3002df39@gmail.com','$2a$10$0FHcQ5lgU5JOYnMEK0aIVOCSZl7ihAt2igFaLMTcq3/h2OuXkgviK','native',NULL,NULL,NULL,NULL,NULL),(178,'pj-midterm-30b55600','pj-midterm-30b55600@gmail.com','$2a$10$wgvH5Tbso69du2lCdnfnN.Xr1HbDFr1sdwQZRrCJD2PtX99l7KrlC','native',NULL,NULL,NULL,NULL,NULL),(179,'pj-midterm-eb3a01e3','pj-midterm-eb3a01e3@gmail.com','$2a$10$pGM7wdW.omX17xAQ55/FUuNWaOFemfFWE.wYWDVjnmYbDzI1jiT/O','native',NULL,NULL,NULL,NULL,NULL),(180,'pj-midterm-81acc493','pj-midterm-81acc493@gmail.com','$2a$10$hoXnKYdDltuGImljfK2RE.nWwHdLXqdS39YaEAoh4PbaG2KYmYPy.','native',NULL,NULL,NULL,NULL,NULL),(181,'pj-midterm-2d0a09b2','pj-midterm-2d0a09b2@gmail.com','$2a$10$p0/WPSYWNx1Jcr79H7Ic0.TeueVIa77oMai3d6ufpuELOaWHTQ/.K','native',NULL,NULL,NULL,NULL,NULL),(182,'pj-midterm-036eb223','pj-midterm-036eb223@gmail.com','$2a$10$wNz/piN20q.SHV412dYTbuknxTUgo.3N0/tVpmc1xWlf8DcBraM8C','native',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-02  6:10:53
