-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: groupproxy
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `company_id` varchar(36) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_description` text,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `membership_till` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `conversationId` varchar(255) NOT NULL,
  `members` json NOT NULL,
  `lastMessageId` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`conversationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventId` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `category` enum('work','personal') NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `members` json NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `file_id` varchar(255) NOT NULL,
  `folder_id` varchar(255) DEFAULT NULL,
  `owner_id` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` bigint NOT NULL,
  `file_path` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metadata_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `folder_id` (`folder_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`) ON DELETE CASCADE,
  CONSTRAINT `files_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES ('file-25a1a7c4',NULL,'74921148-1e12-4dd9-943b-e5c6f8ab2b51','index.js','text/javascript',0,'E:\\Programming\\React Projects\\GroupUp\\storage\\74921148-1e12-4dd9-943b-e5c6f8ab2b51\\drive\\index.js',0,'2025-03-27 22:59:54','2025-03-27 22:59:54','file-25a1a7c4'),('file-9790a268',NULL,'6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','RISHIKESH PRASHNAT PATIL RESUME(2).pdf','application/pdf',790244,'E:\\Programming\\React Projects\\GroupUp\\storage\\6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52\\drive\\RISHIKESH PRASHNAT PATIL RESUME(2).pdf',0,'2025-04-11 14:26:15','2025-04-11 14:26:15','file-9790a268'),('file-a03ede5f',NULL,'6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','FallingTree-1.20.4-1.20.4.3.jar','application/octet-stream',399949,'E:\\Programming\\React Projects\\GroupUp\\storage\\6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52\\drive\\FallingTree-1.20.4-1.20.4.3.jar',0,'2025-03-26 07:27:15','2025-03-26 07:27:15','file-a03ede5f'),('file-bbcfde7b',NULL,'6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','index.html','text/html',2421,'E:\\Programming\\React Projects\\GroupUp\\storage\\6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52\\drive\\index.html',0,'2025-03-27 21:42:53','2025-03-27 21:42:53','file-bbcfde7b');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `folder_id` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `owner_id` varchar(255) NOT NULL,
  `folder_name` varchar(255) NOT NULL,
  `folder_type` enum('project','user') NOT NULL,
  `project_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`folder_id`),
  KEY `owner_id` (`owner_id`),
  KEY `project_id` (`project_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `folders_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`projectID`) ON DELETE CASCADE,
  CONSTRAINT `folders_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `folders` (`folder_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES ('folder-113d69cc',NULL,'5866a080-970b-4e4d-8a0a-689c3d3bdfdb','Test Folder(Test 4)','user',NULL,'2025-03-27 04:33:19'),('folder-2b0e5312',NULL,'6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','Test Folder 1','user',NULL,'2025-03-26 06:12:07'),('folder-4a117d40',NULL,'74921148-1e12-4dd9-943b-e5c6f8ab2b51','Dhruvs Drive Folder Test','user',NULL,'2025-03-27 22:59:00'),('folder-666604da',NULL,'74921148-1e12-4dd9-943b-e5c6f8ab2b51','Folder test 2','user',NULL,'2025-03-27 22:59:21'),('folder-db606822',NULL,'6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','Test Foldfer2','user',NULL,'2025-03-27 21:42:36');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `chatId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `friendId` varchar(255) NOT NULL,
  `status` enum('pending','accepted','declined','blocked') DEFAULT NULL,
  `pfp_Path` varchar(255) DEFAULT NULL,
  `requestedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `acceptedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`chatId`),
  KEY `userId` (`userId`),
  KEY `friendId` (`friendId`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friendId`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES ('chat-2d5c0f','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','69af383a-b50b-4ec0-9c81-146b4e256147','accepted',NULL,'2025-03-25 11:07:52',NULL),('chat-4a3860','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','0b6aabcc-22f0-40d8-95f0-b99482f45154','accepted',NULL,'2025-04-11 11:02:34',NULL),('chat-ceb32b','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','006a8dde-c83c-4bc8-9165-f39a3957cc9d','accepted',NULL,'2025-03-25 10:01:08',NULL),('chat-dc1612','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','5866a080-970b-4e4d-8a0a-689c3d3bdfdb','accepted',NULL,'2025-03-27 16:15:37',NULL),('chat-f55c06','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','6dcec948-82bf-44b6-ab47-a2b1d80f6893','accepted',NULL,'2025-03-20 21:35:04',NULL),('chat-fbcf28','74921148-1e12-4dd9-943b-e5c6f8ab2b51','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','accepted',NULL,'2025-03-27 17:26:19',NULL);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `groupId` (`groupId`),
  KEY `userId` (`userId`),
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups_` (`groupId`) ON DELETE CASCADE,
  CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (13,'group_57fa6619-e2bb-4f3d-bf13-4bf617271c62','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52',1,'2025-04-24 17:19:47'),(14,'group_57fa6619-e2bb-4f3d-bf13-4bf617271c62','6dcec948-82bf-44b6-ab47-a2b1d80f6893',0,'2025-04-24 17:19:47'),(15,'group_57fa6619-e2bb-4f3d-bf13-4bf617271c62','74921148-1e12-4dd9-943b-e5c6f8ab2b51',0,'2025-04-24 17:19:47');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups_`
--

DROP TABLE IF EXISTS `groups_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups_` (
  `groupId` varchar(255) NOT NULL,
  `groupName` varchar(255) NOT NULL,
  `groupDescription` text,
  `created_by` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `chatId` text,
  PRIMARY KEY (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups_`
--

LOCK TABLES `groups_` WRITE;
/*!40000 ALTER TABLE `groups_` DISABLE KEYS */;
INSERT INTO `groups_` VALUES ('group_57fa6619-e2bb-4f3d-bf13-4bf617271c62','Teest group 4','','6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','2025-04-24 11:49:47','chat-61713c');
/*!40000 ALTER TABLE `groups_` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `projectID` varchar(255) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `description` text,
  `ownerId` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_solo` tinyint(1) NOT NULL DEFAULT '1',
  `company_id` varchar(36) DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `membership_till` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`projectID`),
  KEY `fk_project_company` (`company_id`),
  CONSTRAINT `fk_project_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('0d6d2f2e-7fe7-456d-a6d5-3543a72c844a','aand khau\'s Project',NULL,'90460eca-e90c-44d4-8416-2d21f967e458','2024-10-22 06:27:40','2024-10-22 06:27:40',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('298ae1f8-6bf3-4265-bfb3-b3802f2cc397','New Project','This is the description','28bfc805-e80f-41ac-aa16-d7e7a49ba89b','2025-01-26 12:29:10','2025-01-26 12:29:10',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('3738e604-132a-4e14-99df-578a4de959d0','Prometheous\'s Project',NULL,'1b6aba62-6353-46ac-b263-86b965694de4','2024-11-04 03:45:11','2024-11-04 03:45:11',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('3dbfb609-485d-42bf-b720-5de737ff6ea2','TEST2\'s Project',NULL,'199db91a-0f15-4770-8061-6e34bd866834','2024-10-19 10:58:34','2024-10-19 10:58:34',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('4b950113-c613-4e84-8bdc-72ad97fdb9ac','Jhondice\'s Project',NULL,'c4ab0dee-b8ca-47b7-9077-ff4ea2fa8e79','2024-11-17 11:08:26','2024-11-17 11:08:26',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('4f994d9e-1e2c-4f7d-88a2-ed98cf468318','New Project','This is the description','28bfc805-e80f-41ac-aa16-d7e7a49ba89b','2025-01-26 12:29:05','2025-01-26 12:29:05',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('5e2f99eb-c8e5-4f2c-ad60-d23cf9a10e87','test7U\'s Project',NULL,'28bfc805-e80f-41ac-aa16-d7e7a49ba89b','2024-10-22 08:30:27','2024-10-22 08:30:27',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('6640705a-8b3e-4ec8-a76c-193323d01d78','AnkitU\'s Project',NULL,'ad0433b2-e491-4d52-8a2a-2b216dc6513d','2024-10-22 14:07:43','2024-10-22 14:07:43',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('692369f8-e255-415e-aed8-704b673bb7ee','TEST3\'s Project',NULL,'d35c8c4c-46dd-435d-ba55-f8d2c94d57c2','2024-10-19 11:03:10','2024-10-19 11:03:10',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('7163f0a6-bbe0-4c81-882a-c3f17725aad6','New Project','This is the description','28bfc805-e80f-41ac-aa16-d7e7a49ba89b','2025-01-26 12:29:15','2025-01-26 12:29:15',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('7ca83b46-49b4-4833-bbf1-5d93d8b746cc','poi2\'s Project',NULL,'188b431e-6a3c-4993-96e3-71ab283c82e7','2024-10-19 10:25:59','2024-10-19 10:25:59',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('aa58119e-8063-47eb-bb04-89261c95c3bf','aditya\'s Project',NULL,'47e1f41b-81ea-4aad-bd01-4c3688ff28e6','2024-10-19 19:39:30','2024-10-19 19:39:30',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('b6452df1-33dc-4e93-b310-9a577b37660f','5/11/2024User\'s Project',NULL,'293d2304-bc94-48b6-8465-8f4fc91be222','2024-11-05 07:30:19','2024-11-05 07:30:19',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('bad707bd-210c-4240-825d-c9abeccacfd2','TEST4\'s Project',NULL,'d183ee35-c0c9-4705-8de3-24e1653d10c8','2024-10-19 11:07:19','2024-10-19 11:07:19',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('c6337823-2f14-4310-9082-ab1d0b535bc4','TEST6\'s Project',NULL,'a4b3a77b-849a-470a-8d0e-2b84a3aa61c7','2024-10-19 11:10:51','2024-10-19 11:10:51',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('ca388c55-6156-4f05-bfee-7a52d2d8d8a0','rishi24\'s Project',NULL,'b1813dc5-02d1-4900-9210-1de07c4ee7e2','2024-10-22 20:40:26','2024-10-22 20:40:26',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('d2ba00c5-8ab9-4d77-9f93-52031d9bb7ff','TEST5\'s Project',NULL,'f2eee25d-4b02-4610-9d59-4248e7550408','2024-10-19 11:08:48','2024-10-19 11:08:48',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('d72f7485-7490-4429-a9bb-141ec618927e','a\'s Project',NULL,'0e9cc51a-3230-472a-94e2-86bbdb8593f0','2024-10-22 08:35:43','2024-10-22 08:35:43',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('f92e7216-b997-4dd9-9a31-5042b25caef1','Cuntsmasher\'s Project',NULL,'69b3227a-f1c5-4048-88d0-283870e49028','2024-11-11 16:42:16','2024-11-11 16:42:16',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('f9cc063b-2dce-498e-9625-6c7ee697e7f8','poi22\'s Project',NULL,'f7031382-685a-4099-b965-02ec9dd621c0','2024-10-19 10:50:37','2024-10-19 10:50:37',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('ff3ed854-7cbb-4b52-bb1d-44d96446a0f1','ankit24\'s Project',NULL,'ad3e4126-3bb7-4cb0-9d56-b44ed1b8fbaa','2024-10-23 05:36:11','2024-10-23 05:36:11',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22'),('ff42b4a3-a371-45f7-84b8-f08b05ba50b1','test@8\'s Project',NULL,'a3cb84eb-34ba-49be-9b39-b2af73f0351d','2024-11-02 08:57:59','2024-11-02 08:57:59',1,NULL,'2025-03-19 16:02:22',NULL,'2025-03-19 16:02:22','2025-03-19 16:02:22');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `taskId` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `task_description` text,
  `status` enum('pending','in_progress','completed','canceled') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `assignedTo` varchar(36) DEFAULT NULL,
  `projectId` varchar(36) DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`taskId`),
  KEY `assignedTo` (`assignedTo`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`userID`) ON DELETE SET NULL,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`projectID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useractivity`
--

DROP TABLE IF EXISTS `useractivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useractivity` (
  `userID` varchar(255) NOT NULL,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `timeActive` int DEFAULT NULL,
  KEY `userID` (`userID`),
  CONSTRAINT `useractivity_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useractivity`
--

LOCK TABLES `useractivity` WRITE;
/*!40000 ALTER TABLE `useractivity` DISABLE KEYS */;
/*!40000 ALTER TABLE `useractivity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `emailID` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pfpRoute` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` varchar(50) DEFAULT 'user',
  `dateOfBirth` date DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `googleId` varchar(255) DEFAULT NULL,
  `githubId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `emailID` (`emailID`),
  UNIQUE KEY `userName` (`userName`),
  UNIQUE KEY `googleId` (`googleId`),
  UNIQUE KEY `githubId` (`githubId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('006a8dde-c83c-4bc8-9165-f39a3957cc9d','Test Subject 2','test2@gmail.com','Test2','$2b$10$mJC/AvcDXKmjnmJwBkk2k.YC5kFLzdgTlFcIiq5lAKY1xYWzDO//u',NULL,'2025-03-14 09:12:35','2025-03-14 09:12:35','user',NULL,NULL,NULL,NULL,NULL,NULL),('0b6aabcc-22f0-40d8-95f0-b99482f45154','Vedant Ingle','vi@gmail.com','sin disel','$2b$10$wnL7R5Rl/BBi0w.fjT2PFeBYcy3pHze9uQ5.wTWbLIsSbbUePpZQ2',NULL,'2025-04-11 11:01:49','2025-04-11 11:01:49','user',NULL,NULL,NULL,NULL,NULL,NULL),('45a86bdc-df70-408a-b525-26896ebac0b0','Rishikesh Patil','rishi2patil@gmail.com','Ryuk2Kira','$2b$10$SIXTTmoAa4Q901/kTB8eFennZYwnj3ftAtMWLErYR7oSw4C41i5hy',NULL,'2025-03-07 10:22:23','2025-03-07 10:22:23','user',NULL,NULL,NULL,NULL,NULL,NULL),('5866a080-970b-4e4d-8a0a-689c3d3bdfdb','Test Subject 4','test4@gmail.com','Test 4','$2b$10$Z7hd.rlJqSXtfPkDzEUWH.cA0P4AEAHhWVRxaS9X9phcKJ2YE4gYG',NULL,'2025-03-26 20:48:34','2025-03-26 20:48:34','user',NULL,NULL,NULL,NULL,NULL,NULL),('69af383a-b50b-4ec0-9c81-146b4e256147','Test Subject 3','test3@gmail.com','Test3','$2b$10$/5lcaEXHGRUlUKuMOv8qdOUa8hskDZkLyw..BvOwrKazwwqbFTWyG',NULL,'2025-03-14 09:18:04','2025-03-14 09:18:04','user',NULL,NULL,NULL,NULL,NULL,NULL),('6b695ce9-f7a8-44f7-b989-d2a3a2ffdc52','New User','useremail@gmail.com','newuser','$2b$10$4BCd1I1hOc7f3DccJus01OvpbwUPYCJrn03i2cw3oSNcUE70rVz2u',NULL,'2025-02-27 23:31:52','2025-02-27 23:31:52','user',NULL,NULL,NULL,NULL,NULL,NULL),('6dcec948-82bf-44b6-ab47-a2b1d80f6893','Chaitanya Karhadkar','c@gmail.com','misal paav','$2b$10$kCtwnvmBTTATeSQfoxMM5eiL.h2zOcfsqmD89eTKYsJtza6/jsNiO',NULL,'2025-03-19 21:48:34','2025-03-19 21:48:34','user',NULL,NULL,NULL,NULL,NULL,NULL),('74921148-1e12-4dd9-943b-e5c6f8ab2b51','Dhruv Salehittal','dhruve@gmail.com','Dhruv','$2b$10$S.s/TP82CliwPCIlj3QQ4.zPsybQp6z3ivRPhgslu7VSwl0D/AMgq',NULL,'2025-03-27 17:22:08','2025-03-27 17:22:08','user',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voice_channel_members`
--

DROP TABLE IF EXISTS `voice_channel_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voice_channel_members` (
  `channelId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  PRIMARY KEY (`channelId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `voice_channel_members_ibfk_1` FOREIGN KEY (`channelId`) REFERENCES `voice_channels` (`channelId`) ON DELETE CASCADE,
  CONSTRAINT `voice_channel_members_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voice_channel_members`
--

LOCK TABLES `voice_channel_members` WRITE;
/*!40000 ALTER TABLE `voice_channel_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `voice_channel_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voice_channels`
--

DROP TABLE IF EXISTS `voice_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voice_channels` (
  `channelId` varchar(255) NOT NULL,
  `channelName` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`channelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voice_channels`
--

LOCK TABLES `voice_channels` WRITE;
/*!40000 ALTER TABLE `voice_channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `voice_channels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-27 14:54:43
