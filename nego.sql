-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: מאי 31, 2023 בזמן 11:03 AM
-- גרסת שרת: 10.4.19-MariaDB
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";




CREATE DATABASE IF NOT EXISTS `db_admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_admin`;




CREATE TABLE `insight` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` text NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `insight` (`id`, `username`, `title`, `content`) 
VALUES (1, 'anets', 'Brothers conflict', 'undefined');




CREATE TABLE `expertise` (
  `expertiseCode` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE
);


INSERT INTO `expertise` (`name`) VALUES
  ('Criminal Law'),
  ('Family Law'),
  ('Corporate Law'),
  ('Intellectual Property Law'),
  ('Immigration Law'),
  ('Real Estate Law');




CREATE TABLE `user` (
  `userCode` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `username` varchar(255) NOT NULL UNIQUE,
  `phone` varchar(15) NOT NULL UNIQUE,
  `education` varchar(255) DEFAULT NULL,
  `userType` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `professionalExperience` varchar(255) DEFAULT NULL,
  `expertiseCode` int(11) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (`expertiseCode`) REFERENCES `expertise` (`expertiseCode`)
);


INSERT INTO `user` (`userCode`, `firstName`, `lastName`, `email`, `username`, `phone`, `education`, `userType`, `password`, `professionalExperience`, `expertiseCode`, `approved`) VALUES
(1, 'admin', 'admin', 'admin@gmail.com', 'admin', '0542683936', NULL, 'manager', '1234', NULL, NULL, 0),

(2, 'Bar', 'Konyo', 'bar688@gmail.com', 'baros', '0542863838', 'University', 'mediator', '111', 'Four years experience in family conflicts', 2, 1),
(3, 'Bar', 'Pinto', 'barpinto@technion.ac.il', 'barp', '0506634891', 'Professional certificate', 'mediator', 'ba', 'Expert in immigration conflicts', 5, 1),
(4, 'Anet', 'Shuminov', 'ashum@technion.ac.il', 'anets', '0523457779', 'University', 'mediator', 'as', 'Expert in labor and employment law', 3, 1),
(5, 'Shir', 'Asa', 'shas@technion.ac.il', 'ashir', '0557835692', 'University', 'mediator', 'asd', 'Ten years experience in marriage mediation', 2, 0),
(6, 'temp', 'temp', 'negoflict255@gmail.com', 'tempuser', '0542863848', 'no', 'mediator', '123', 'no', NULL, 0),

(7, 'Mediator', 'One', 'mediator1@example.com', 'mediator1', '0542223333', 'Law School', 'mediator', 'mediator1pass', 'Experienced in civil disputes, including criminal law cases.', 1, 1),
(8, 'Mediator', 'Two', 'mediator2@example.com', 'mediator2', '0544445555', 'Law School', 'mediator', 'mediator2pass', 'Specialized in property disputes, particularly real estate law.', 6, 1),
(9, 'Mediator', 'Three', 'mediator3@example.com', 'mediator3', '0546667777', 'Law School', 'mediator', 'mediator3pass', 'Skilled in commercial disputes and corporate law matters.', 3, 1),
(10, 'Mediator', 'Four', 'mediator4@example.com', 'mediator4', '0547778888', 'Law School', 'mediator', 'mediator4pass', 'Expert in labor disputes, including employment law cases.', 3, 1),
(11, 'Mediator', 'Five', 'mediator5@example.com', 'mediator5', '0548889999', 'Law School', 'mediator', 'mediator5pass', 'Experienced in contract disputes and intellectual property law.', 4, 1),
(12, 'Mediator', 'Six', 'mediator6@example.com', 'mediator6', '0549990000', 'Law School', 'mediator', 'mediator6pass', 'Skilled in environmental disputes, including immigration law cases.', 5, 1),

(13, 'David', 'Choen', 'da@gmail.com', 'davisa', '0542683896', NULL, 'negotiator', 'da1', NULL, NULL, 0),
(14, 'Anton', 'Rubinsky', 'shirasa92@gmail.com', 'Ruba', '0543968575', NULL, 'negotiator', 'daf', NULL, NULL, 0),
(15, 'Coral', 'Kirschenbaum', 'bar6889@gmail.com', 'coralkir', '0543649271', NULL, 'negotiator', '1234', NULL, NULL, 0),
(16, 'Sapir', 'Nir', 'sapir@gmail.com', 'nir', '0526839589', NULL, 'negotiator', '123456', NULL, NULL, 0),
(17, 'Nir', 'Kaftori', 'nirkaf@gmail.com', 'kaftnir', '0507865554', NULL, 'negotiator', 'kaf2314', NULL, NULL, 0),
(18, 'Ido', 'Jorno', 'ido15641@walla.com', 'idojorno', '0523144400', NULL, 'negotiator', '1234', NULL, NULL, 0);




CREATE TABLE `negotiation` (
  `negoid` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userCode1` int(11) NOT NULL,
  `userCode2` int(11) NOT NULL,
  `mediatorCode` int(11) NOT NULL,
  `topicCode` int(11) NOT NULL,
  `title` text NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `endTime` timestamp NULL DEFAULT NULL,
  `description` text NOT NULL,
  `summary` text DEFAULT NULL,


   KEY `userCode1` (`userCode1`,`userCode2`),
   KEY `userCode2` (`userCode2`),
   KEY `mediatorCode` (`mediatorCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `negotiation` ( `userCode1`, `userCode2`, `mediatorCode`, `topicCode`, `title`, `startTime`, `endTime`, `description`, `summary`) VALUES
(17, 14, 2, 1, 'Stolen money', '2021-05-13 16:17:40', '2021-05-13 16:17:40', 'Anton works as a gardener for Nir and Nir suspects he stole from him', NULL),
(14, 15, 3, 2, 'Divorce', '2021-05-13 18:17:25', '2021-05-13 17:57:45', 'Coral and Anton have been married for 5 years and want to divorce', 'bidaokl'),
(15, 13, 4, 2, 'Brothers conflict', '2021-05-13 07:34:57', NULL, 'Coral and David want to resolve dispute over inheritance', NULL),
(16, 17, 6, 5, 'Friends conflict', '2021-05-13 07:36:17', '2021-04-19 08:21:11', 'Nir and Sapir want to go immigrate together but Sapir wants to fly to Greece while Nir wants to fly to USA', NULL),
(17, 13, 2, 6, 'Money loan', '2021-05-12 18:58:01', NULL, 'David has borrowed money from Nir and cannot return the full amount on time', NULL),
(17, 16, 1, 1, 'High school fight', '2021-05-11 21:31:04', NULL, 'David and Sapir are best friends who fall in love with the same girl', NULL),
(2, 10, 5, 3, 'Work conflict', '2021-05-12 18:22:57', NULL, 'Coral and David work together and during the job David does not do his part', NULL);




CREATE TABLE `message` (
  `messageCode` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `content` text NOT NULL,
  `userCode` int(11) NOT NULL DEFAULT 1,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `negoid` int(11) NOT NULL,
   CONSTRAINT `message_ibfk_1` FOREIGN KEY (`userCode`) REFERENCES `user` (`userCode`),
   CONSTRAINT `message_ibfk_2` FOREIGN KEY (`negoid`) REFERENCES `negotiation` (`negoid`),


   KEY `userCode` (`userCode`),
   KEY `negoid` (`negoid`),
   KEY `negoid_2` (`negoid`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `message` (`messageCode`, `content`, `userCode`, `time`, `negoid`) 
VALUES
(10, 'Hey nir', 14, '2021-04-15 08:01:59', 1),
(11, 'Hey Anton', 17, '2021-04-15 08:02:11', 1),
(12, 'I really want to explain myself because i think there was a big cofusion', 14, '2021-04-17 11:45:01', 1),
(13, 'Ok, im waitng to hear your side of the story', 17, '2021-04-17 11:45:08', 1),
(14, 'Hey Anton', 15, '2021-04-17 12:12:57', 2),
(15, 'Hey Coral', 14, '2021-04-17 12:13:20', 2),
(16, 'Before you say something i just want to say that i love you and want  to try fix everything ', 14, '2021-04-17 12:13:22', 2),
(17, 'I love you too, but im not sure that in the same way', 15, '2021-04-18 17:17:31', 2),
(18, 'I want to divorce', 15, '2021-04-18 17:17:37', 2),
(100, 'Hey Coral', 13, '2021-04-18 19:19:49', 3),
(101, 'Im not sure im ready to talk with you yet, but lts try', 13, '2021-04-19 13:46:02', 3),
(102, 'You dont want to speak with me?????', 15, '2021-04-22 07:49:06', 3),
(103, 'You are the one that caused this situation!!! I hate you!!!!!!!!!!!!!!!!', 15, '2021-04-22 07:50:33', 3),
(104, 'Hey Coral, lets try to use nicer words . we try to fix things not to destroy them.', 2, '2021-04-22 07:50:36', 3),
(105, 'Hey Nir, this my bechelor party and i thinmk i should choose the location', 16, '2021-04-22 07:50:45', 4),
(106, 'I agree, but i think it will be even better if it will be a suprise', 17, '2021-04-22 07:50:49', 4),
(107, 'Im not sure we love the same type of vacations', 16, '2021-04-22 07:57:29', 4),
(108, 'As my best frind i thought you will trust me more', 17, '2021-05-04 16:37:29', 4),
(109, 'You are a liar!!! you promised ill get my money back on time!!!', 17, '2021-05-04 16:37:42', 5),
(110, 'Hey i really want us to try keep using nice words to each other', 9, '2021-05-04 16:39:25', 5),
(111, 'You always speak like that! thats why we cant have a normal conversation', 13, '2021-05-04 16:40:43', 5),
(112, 'Im furious right now', 17, '2021-05-04 16:41:41', 5),
(113, 'I cant believe you did this, you knew what she is for me', 13, '2021-05-04 16:42:43', 6),
(114, 'What you want me to do? she love me', 16, '2021-05-04 16:43:56', 6),
(115, 'I dont think we can fix things, im really mad at you', 15, '2021-05-04 16:44:09', 7);




CREATE TABLE `notifications` (
  `id` int(11) NOT NULL NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `UserCode` int(11) NOT NULL,
  `content` text NOT NULL,
  `isSeen` int(1) NOT NULL DEFAULT 0,
   CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`UserCode`) REFERENCES `user` (`userCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `notifications` (`id`, `UserCode`, `content`, `isSeen`) 
VALUES
(1, 2, 'Please check your Email', 1),
(2, 5, 'Dont forget to change your password', 0),
(3, 17, 'Please answer on our service', 1),
(4, 17, 'Dont forget to fil all negotiation details', 0),
(5, 5, 'Please check your negotiation last messages', 1),
(6, 5, 'Please update your profile', 0);




ALTER TABLE `negotiation`
  ADD CONSTRAINT `negotiation_ibfk_1` FOREIGN KEY (`userCode1`) REFERENCES `user` (`userCode`),
  ADD CONSTRAINT `negotiation_ibfk_2` FOREIGN KEY (`userCode2`) REFERENCES `user` (`userCode`),
  ADD CONSTRAINT `negotiation_ibfk_4` FOREIGN KEY (`mediatorCode`) REFERENCES `user` (`userCode`);