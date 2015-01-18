-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 15-01-18 14:06
-- 서버 버전: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `wip`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `todo`
--

CREATE TABLE IF NOT EXISTS `todo` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `project_idx` int(11) NOT NULL,
  `task_idx` int(11) NOT NULL,
  `user_idx` int(11) NOT NULL,
  `receiver_idx` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_finish` tinyint(4) NOT NULL DEFAULT '0',
  UNIQUE KEY `idx_3` (`idx`),
  KEY `idx` (`idx`),
  KEY `idx_2` (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 테이블의 덤프 데이터 `todo`
--

INSERT INTO `todo` (`idx`, `title`, `project_idx`, `task_idx`, `user_idx`, `receiver_idx`, `due_date`, `insert_date`, `is_finish`) VALUES
(1, 'todo title', 4, 2, 1, 7, '2015-01-07', '2015-01-06 13:59:03', 0),
(2, '할일2', 4, 1, 1, 7, '2015-01-29', '2015-01-18 12:18:22', 0),
(3, '할일3', 4, 1, 1, 7, '2015-01-31', '2015-01-18 12:18:22', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
