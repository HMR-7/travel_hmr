/*
Navicat MySQL Data Transfer

Source Server         : travel
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : travel

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2020-04-13 23:05:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `userinfo`
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_phone` varchar(255) CHARACTER SET utf8 NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=big5;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('136', '17853558905', 'HMR ⁶⁶⁶');
INSERT INTO `userinfo` VALUES ('137', '17853558905', 'HMR ⁶⁶⁶');
INSERT INTO `userinfo` VALUES ('138', '17853558905', 'HMR ⁶⁶⁶');
