-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 11:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payroll_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `e_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `gender` varchar(10) NOT NULL,
  `birthday` date NOT NULL,
  `phone_no` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `street_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `department` varchar(100) NOT NULL,
  `project` varchar(100) NOT NULL,
  `team` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `employment` varchar(100) NOT NULL,
  `date_hired` date NOT NULL,
  `base_monthly_pay` decimal(10,2) NOT NULL,
  `user_profile` varchar(255) NOT NULL,
  `pay_frequency` varchar(50) NOT NULL,
  `tax_id` varchar(50) NOT NULL,
  `sss_gsis_no` varchar(50) NOT NULL,
  `phic_id` varchar(50) NOT NULL,
  `hdmf_id` varchar(50) NOT NULL,
  `bank` varchar(100) NOT NULL,
  `bank_account` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `e_id`, `first_name`, `middle_name`, `last_name`, `suffix`, `gender`, `birthday`, `phone_no`, `email`, `street_address`, `city`, `province`, `zip`, `department`, `project`, `team`, `position`, `employment`, `date_hired`, `base_monthly_pay`, `user_profile`, `pay_frequency`, `tax_id`, `sss_gsis_no`, `phic_id`, `hdmf_id`, `bank`, `bank_account`, `created_at`, `updated_at`) VALUES
(8, '123', 'Jessie', 'G', 'Porteria', 'III', 'Male', '1999-10-23', '1232133', 'test@test.com', 'asdfa', 'Quezon City', 'Metro Manila', '2344', 'IT', 'NA', 'NA', 'Web Dev', 'NA', '2025-05-01', 99999.00, 'Administrator', 'Bi-Weekly', '21123', '321312', '213123', '32131', '2312', '321312', '2025-05-11 07:59:27', '2025-05-11 23:49:47'),
(9, 'aaa', 'Juan', '', 'Dela Cruz', 'jr', 'Male', '2025-05-04', '234234', 'test@test.com', 'fsdfs', 'Quezon City', 'Metro Manila', '24324', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-04-30', 23423.00, 'Member', 'weekly', '32432', '32432', '34234', '324234', '34234', '342423', '2025-05-11 10:00:10', '2025-05-11 10:00:10'),
(10, 'bbb', 'John', '', 'Doe', 'IV', 'Male', '2025-05-05', '3423442', 'test@test.com', '123 st', 'NY', 'NA', '3423', 'NA', 'sdfsd', 'NA', 'NA', 'NA', '2025-05-06', 34234.00, 'Member', 'Monthly', '34234', '432423', '423423', '34234', 'NA', '2423', '2025-05-11 20:34:10', '2025-05-11 20:34:10'),
(11, 'ccc', 'Jane', '', 'Doe', '', 'Female', '2025-05-04', '34234324', 'test@test.com', '123 st', 'NY', 'NA', '1234', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-04', 24324.00, 'Member', 'Monthly', '234324', '432423', '432423', '34234', 'NA', 'NA', '2025-05-11 20:39:40', '2025-05-11 20:39:40'),
(12, 'ddd', 'Donald', '', 'Trump', '', 'Male', '2025-04-30', '42344', 'test@test.com', '343 west', 'NA', 'NA', '4234', 'NA', 'NA', 'NA', 'President', 'NA', '2025-05-01', 23432.00, 'Member', 'Everyday', '23324', '432423', '423423', '34234', 'NA', 'NA', '2025-05-11 20:43:06', '2025-05-11 20:43:06'),
(13, 'eee', 'Jinwoo', '', 'Sung', '', 'Male', '2025-04-30', '78979', 'test@test.com', '767 east', 'NA', 'NA', '7878', 'NA', 'NA', 'NA', 'Monarch', 'NA', '2025-05-07', 32423.00, 'Member', 'Daily', '213123', 'fsdfs', 'fsdfas', '4r2wefe', '423423', 'dfewf', '2025-05-11 21:16:17', '2025-05-11 21:16:17'),
(14, 'fff', 'Jue', 'Viole', 'Grace', '', 'Male', '2025-04-28', '78987', 'test@test.com', '2312 north', 'NA', 'NA', '7878', 'NA', 'NA', 'NA', 'Wave Controller', 'NA', '2025-05-06', 2323.00, 'Member', 'Daily', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-11 21:18:54', '2025-05-11 21:21:14'),
(15, 'ggg', 'Luffy', 'D', 'Monkey', '', 'Male', '2025-08-20', '89890', 'test@test', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'Emperor', 'NA', '2025-05-08', 6868.00, 'NA', '8787', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-11 21:23:25', '2025-05-11 21:23:25'),
(16, 'hhh', 'Zoro', '', 'Roronoa', '', 'Male', '2025-04-30', '89898', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'Swordsman', 'NA', '2025-05-08', 23324.00, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-11 21:25:07', '2025-05-11 21:25:07'),
(17, 'iii', 'Baki', '', 'Hanma', '', 'Male', '2025-05-07', '423423', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'Grappler', 'NA', '2025-05-08', 23423.00, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-11 21:27:29', '2025-05-11 21:27:29'),
(19, 'jjj', 'Roger', 'D', 'Gol', '', 'Male', '2025-05-06', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'Pirate King', 'NA', '2025-05-08', 4234.00, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-11 23:51:20', '2025-05-11 23:51:20'),
(20, 'kkk', 'Joe', '', 'Goldberg', '', 'Male', '2025-04-30', '234234', 'NA@NA.NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-08', 4324.00, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', '2025-05-12 09:12:26', '2025-05-12 09:12:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `e_id` (`e_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
