-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 15-01-02 10:54
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 테이블의 덤프 데이터 `project`
--

INSERT INTO `project` (`idx`, `name`, `master_idx`, `insert_date`, `modify_date`) VALUES
(4, 'project1', 1, '2015-01-02 09:06:06', '0000-00-00 00:00:00');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci AUTO_INCREMENT=7 ;

--
-- 테이블의 덤프 데이터 `user`
--

INSERT INTO `user` (`idx`, `id`, `password`, `name`, `accessToken`, `insert_date`, `last_login_date`) VALUES
(1, 'guruahn@gmail.com', '9c4d61ec636053f7c6d32cd5f71f537178571c8a', 'guruahn', '0070331677524ea794321e73d72a826976f4fd2c', '2015-01-01 09:24:53', '2015-01-01 09:01:53'),
(2, 'schemr', 'ec84e66195963ea033b67c0dc7ef547c402761a1', 'lee', '4d6ac515f0d242886d375befacccb57d513327ba', '2015-01-01 10:01:59', '2015-01-01 10:01:59'),
(6, 'fdf', '07ad1e3bdc12b98c4d0dff753229ea701dd711e2', 'ff', 'e2b18dbe6cc2a3fc3a4293dab126f70ab0c76463', '2015-01-01 10:08:30', '2015-01-01 10:01:30');

-- --------------------------------------------------------

--
-- 테이블 구조 `user_project`
--

CREATE TABLE IF NOT EXISTS `user_project` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_idx` int(11) NOT NULL,
  `project_idx` int(11) NOT NULL,
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 테이블의 덤프 데이터 `user_project`
--

INSERT INTO `user_project` (`idx`, `user_idx`, `project_idx`, `insert_date`) VALUES
(1, 1, 4, '2015-01-02 09:06:06');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
