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
-- 테이블 구조 `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '과업 이름',
  `description` varchar(255) NOT NULL COMMENT '과업 설명',
  `project_idx` int(11) NOT NULL COMMENT '프로젝트 고유번호',
  `creator_idx` int(11) NOT NULL COMMENT '과업 생성자',
  `category` varchar(100) NOT NULL DEFAULT 'Uncategorized' COMMENT '과업 카테고리',
  `related_link` varchar(255) NOT NULL,
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '과업 생성일',
  `modify_date` timestamp NOT NULL COMMENT '과업 수정일',
  PRIMARY KEY (`idx`),
  KEY `idx` (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='과업-프로젝트 종속' AUTO_INCREMENT=4 ;

--
-- 테이블의 덤프 데이터 `task`
--

INSERT INTO `task` (`idx`, `name`, `description`, `project_idx`, `creator_idx`, `category`, `related_link`, `insert_date`, `modify_date`) VALUES
(1, '과업 첫 번째', '과업 첫 번째 영광스런 첫 번째 과업입니다. 와우 신나', 4, 1, 'Uncategorized', '', '2015-01-03 18:45:11', '0000-00-00 00:00:00'),
(2, '과업 두 번째', '과업 두 번째 영광스런 두 번째 과업입니다. 와우 신나', 4, 1, 'Uncategorized', '', '2015-01-03 18:52:24', '0000-00-00 00:00:00'),
(3, '과업 세 번째', '과업 세 번째의 상세설명', 4, 1, 'task list', '', '2015-01-03 19:58:25', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
