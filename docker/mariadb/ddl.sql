CREATE DATABASE `credit-transfer` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `credit-transfer`;

-- `credit-transfer`.form definition

CREATE TABLE `form`
(
    `id`                  int(10) unsigned              NOT NULL AUTO_INCREMENT,
    `type`                enum ('a','b')                NOT NULL,
    `stu_name`            varchar(45)                   NOT NULL,
    `stu_id`              varchar(20)                   NOT NULL,
    `stu_tel`             varchar(20)                   NOT NULL,
    `edu_sys`             enum ('','1','2','3','4','5') NOT NULL,
    `campus`              enum ('','1','2','3','4','5') NOT NULL,
    `department`          varchar(60)                   NOT NULL,
    `grade`               varchar(10)                   NOT NULL,
    `class`               varchar(10)                   NOT NULL,
    `stu_type`            enum ('','1','2','3','4','5') NOT NULL,
    `stu_type_school`     varchar(60)                            DEFAULT NULL,
    `stu_type_department` varchar(60)                            DEFAULT NULL,
    `stu_type_other`      varchar(90)                            DEFAULT NULL,
    `pwd`                 varchar(200)                  NOT NULL,
    `file_name`           varchar(30)                            DEFAULT NULL,
    `editable`            tinyint(1)                    NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;

-- `credit-transfer`.course_transform definition

CREATE TABLE `course_transform`
(
    `form_id`    int(10) unsigned               NOT NULL,
    `get_term`   varchar(15)                    DEFAULT NULL,
    `get_name`   varchar(60)                    DEFAULT NULL,
    `get_credit` varchar(15)                    DEFAULT NULL,
    `get_score`  varchar(15)                    DEFAULT NULL,
    `set_term`   varchar(15)                    DEFAULT NULL,
    `set_name`   varchar(60)                    DEFAULT NULL,
    `set_credit` varchar(15)                    DEFAULT NULL,
    `set_type`   enum ('0','1','2','3','4','5') DEFAULT NULL,
    `set_verify` enum ('0','1','2')             DEFAULT NULL,
    `index`      enum ('1','2','3','4','5','6') NOT NULL,
    UNIQUE KEY `course_transform_un` (`form_id`, `index`),
    CONSTRAINT `subject_transform_FK` FOREIGN KEY (`form_id`) REFERENCES `form` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- `credit-transfer`.admin definition

CREATE TABLE `admin`
(
    `id`        int(10) unsigned NOT NULL AUTO_INCREMENT,
    `username`  varchar(100)     NOT NULL,
    `password`  varchar(100)     NOT NULL,
    `email`     varchar(100)     NOT NULL,
    `real_name` varchar(100)     NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admin_un` (`username`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;

INSERT INTO `credit-transfer`.admin (id, username, password, email, real_name)
VALUES (1, 'admin', 'admin', 'nkust.ee.ct@gmail.com', '管理員');

-- `credit-transfer`.`user` definition

CREATE TABLE `user` (
  `mail` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `verify` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;