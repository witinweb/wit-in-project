-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 15-01-18 13:56
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
-- 테이블 구조 `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `idx` int(11) NOT NULL AUTO_INCREMENT COMMENT '프로젝트 고유 아이디',
  `name` varchar(100) NOT NULL COMMENT '프로젝트 이름',
  `master_idx` int(11) NOT NULL COMMENT '생성자 아이디',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '입력일시',
  `modify_date` timestamp NOT NULL COMMENT '수정일시',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- 테이블의 덤프 데이터 `project`
--

INSERT INTO `project` (`idx`, `name`, `master_idx`, `insert_date`, `modify_date`) VALUES
(4, '232123123123', 1, '2015-01-02 09:06:06', '0000-00-00 00:00:00'),
(5, 'test', 1, '2015-01-06 13:51:00', '0000-00-00 00:00:00'),
(6, 'asdf', 1, '2015-01-06 13:51:39', '0000-00-00 00:00:00'),
(7, 'newproject', 1, '2015-01-18 09:49:01', '0000-00-00 00:00:00'),
(8, 'newprojectdsdf', 1, '2015-01-18 09:52:12', '0000-00-00 00:00:00'),
(9, 'newprojectdsdfdfdf', 1, '2015-01-18 10:15:27', '0000-00-00 00:00:00'),
(10, 'newprojectdsdfdfdfadfasdf', 1, '2015-01-18 10:15:55', '0000-00-00 00:00:00'),
(11, 'newprojectdsdfdfdfadfasdfasdfsdf', 1, '2015-01-18 10:22:56', '0000-00-00 00:00:00'),
(12, 'newprojectdsdfdfdfadfasdfasdfsdf', 1, '2015-01-18 10:23:30', '0000-00-00 00:00:00'),
(17, 'dsdfsd', 1, '2015-01-18 11:01:36', '0000-00-00 00:00:00'),
(18, 'qqqqqqqq', 1, '2015-01-18 11:07:46', '0000-00-00 00:00:00');

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
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '과업 생성일',
  `modify_date` timestamp NOT NULL COMMENT '과업 수정일',
  PRIMARY KEY (`idx`),
  KEY `idx` (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='과업-프로젝트 종속' AUTO_INCREMENT=4 ;

--
-- 테이블의 덤프 데이터 `task`
--

INSERT INTO `task` (`idx`, `name`, `description`, `project_idx`, `creator_idx`, `category`, `insert_date`, `modify_date`) VALUES
(1, '과업 첫 번째', '과업 첫 번째 영광스런 첫 번째 과업입니다. 와우 신나', 4, 1, 'Uncategorized', '2015-01-03 18:45:11', '0000-00-00 00:00:00'),
(2, '과업 두 번째', '과업 두 번째 영광스런 두 번째 과업입니다. 와우 신나', 4, 1, 'Uncategorized', '2015-01-03 18:52:24', '0000-00-00 00:00:00'),
(3, '과업 세 번째', '과업 세 번째의 상세설명', 4, 1, 'task list', '2015-01-03 19:58:25', '0000-00-00 00:00:00');

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

-- --------------------------------------------------------

--
-- 테이블 구조 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(255) COLLATE utf8_estonian_ci NOT NULL COMMENT '사용자 아이디',
  `password` varchar(255) COLLATE utf8_estonian_ci NOT NULL COMMENT '비밀번호',
  `name` varchar(100) COLLATE utf8_estonian_ci NOT NULL COMMENT '이름/별명',
  `accessToken` varchar(255) COLLATE utf8_estonian_ci NOT NULL COMMENT '접속 토큰',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '가입일시',
  `last_login_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '최근 로그인 일시',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci AUTO_INCREMENT=9 ;

--
-- 테이블의 덤프 데이터 `user`
--

INSERT INTO `user` (`idx`, `id`, `password`, `name`, `accessToken`, `insert_date`, `last_login_date`) VALUES
(1, 'guruahn@gmail.com', '9c4d61ec636053f7c6d32cd5f71f537178571c8a', 'guruahn', '85d8b7a643291d34834c31750d7b3cedda8aac93', '2015-01-18 11:01:56', '2015-01-18 11:01:56'),
(2, 'schemr', 'ec84e66195963ea033b67c0dc7ef547c402761a1', 'lee', '4d6ac515f0d242886d375befacccb57d513327ba', '2015-01-01 10:01:59', '2015-01-01 10:01:59'),
(6, 'fdf', '07ad1e3bdc12b98c4d0dff753229ea701dd711e2', 'ff', 'e2b18dbe6cc2a3fc3a4293dab126f70ab0c76463', '2015-01-01 10:08:30', '2015-01-01 10:01:30'),
(7, 'zesta@naver.com', 'ec84e66195963ea033b67c0dc7ef547c402761a1', 'zesta', 'f892e6a69bce83d6fe3b390043816f1e73af428a', '2015-01-03 09:11:29', '0000-00-00 00:00:00'),
(8, 'anmarine@naver.com', '9c4d61ec636053f7c6d32cd5f71f537178571c8a', '정우', 'd8f5aa620b5a4cce91f772faf745529ed6467af5', '2015-01-18 08:48:04', '2015-01-18 08:01:04');

-- --------------------------------------------------------

--
-- 테이블 구조 `user_project`
--

CREATE TABLE IF NOT EXISTS `user_project` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_idx` int(11) NOT NULL,
  `project_idx` int(11) NOT NULL,
  `is_manager` int(1) NOT NULL DEFAULT '0' COMMENT '관리자 여부',
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- 테이블의 덤프 데이터 `user_project`
--

INSERT INTO `user_project` (`idx`, `user_idx`, `project_idx`, `is_manager`, `insert_date`) VALUES
(1, 1, 4, 0, '2015-01-02 09:06:06'),
(2, 1, 5, 1, '2015-01-06 13:51:00'),
(3, 1, 6, 1, '2015-01-06 13:51:39'),
(4, 1, 7, 1, '2015-01-18 09:49:01'),
(5, 1, 8, 1, '2015-01-18 09:52:12'),
(6, 1, 9, 1, '2015-01-18 10:15:27'),
(7, 1, 10, 1, '2015-01-18 10:15:55'),
(8, 1, 11, 1, '2015-01-18 10:22:56'),
(9, 1, 12, 1, '2015-01-18 10:23:30'),
(14, 1, 17, 1, '2015-01-18 11:01:36'),
(15, 1, 18, 1, '2015-01-18 11:07:46');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
