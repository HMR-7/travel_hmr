/*
 Navicat Premium Data Transfer

 Source Server         : hmr
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : travel

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 16/04/2020 18:28:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for detail
-- ----------------------------
DROP TABLE IF EXISTS `detail`;
CREATE TABLE `detail`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `good_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `good_price` float(10, 2) NULL DEFAULT NULL,
  `src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `swipeArr` varchar(655) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `introduce` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `childTicket` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of detail
-- ----------------------------
INSERT INTO `detail` VALUES (1, '蓬莱阁景区', 88.00, 'http://img.alicdn.com/i3/170090268524400251/TB2zhofXhvzQeBjSZPfXXbWGFXa_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/170090268524400251/TB2zhofXhvzQeBjSZPfXXbWGFXa_!!0-travel.jpg_750x388q80.jpg,http://img.alicdn.com/i3/170090268524465191/TB2KkINXw_xQeBjy0FoXXX1vpXa_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1NR0VilTH8KJjy0FiSuwRsXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '碑刻匾额满目,人间仙境', '八仙过海”神话源于此，可以远眺黄海与渤海的交界处。', '43');
INSERT INTO `detail` VALUES (2, '八仙过海景区', 40.00, 'http://img.alicdn.com/i2/152440259742608991/TB21WuztFXXXXbrXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i2/152440259742608991/TB21WuztFXXXXbrXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,http://img.alicdn.com/i1/152440259742796106/TB22mJ6tFXXXXayXpXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1o6_Zk6qhSKJjSspnSuw79XXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1XX.heIjI8KJjSsppSutbyVXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '传说中八仙过海的地方，可以感受道教文化，欣赏海景。', '20');
INSERT INTO `detail` VALUES (3, '三仙山景区', 64.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '壮观仿古建筑群,仙山怀老', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', '43');
INSERT INTO `detail` VALUES (4, '测试景区1', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (5, '测试景区2', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (6, '测试景区3', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (7, '测试景区4', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (8, '测试景区5', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (9, '测试9', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (10, '测试10', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (11, '测试11', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);
INSERT INTO `detail` VALUES (12, '测试12', 9999.00, 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg', 'http://img.alicdn.com/i3/152410264913421435/TB2092suXXXXXXlXXXXXXXXXXXX_!!0-travel.jpg_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1SXfukWagSKJjy0FbSuu.mVXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1ZwLGkWmgSKJjSsphSuwy1VXa_750x388q80.jpg,https://img.alicdn.com/tfscom/TB1U7V9eN6I8KJjSszfSuuZVXXa_750x388q80.jpg', '烟台市蓬莱市海滨路9号', '八仙渡口,探索神话传说', '珍藏众多，精美的雕刻，巨大的金丝楠木，都值得一看。', NULL);

-- ----------------------------
-- Table structure for food
-- ----------------------------
DROP TABLE IF EXISTS `food`;
CREATE TABLE `food`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `food_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `food_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food
-- ----------------------------
INSERT INTO `food` VALUES (1, '蓬莱小面', NULL);

-- ----------------------------
-- Table structure for hotel
-- ----------------------------
DROP TABLE IF EXISTS `hotel`;
CREATE TABLE `hotel`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `hotel_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotel
-- ----------------------------
INSERT INTO `hotel` VALUES (1, '文成城堡', NULL);
INSERT INTO `hotel` VALUES (2, '蓬莱旅店', NULL);

-- ----------------------------
-- Table structure for travellog
-- ----------------------------
DROP TABLE IF EXISTS `travellog`;
CREATE TABLE `travellog`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `user_head` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `article` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of travellog
-- ----------------------------

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `userPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES (1, 'HMR ⁶⁶⁶', '17853558905', 'owVCB4rl5T_THnCrKF0fbujJdKXM');

SET FOREIGN_KEY_CHECKS = 1;
