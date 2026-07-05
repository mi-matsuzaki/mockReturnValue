const { getUserById } = require("./userService");

// 注文を処理する（ユーザー情報に依存する）
function processOrder(userId, item) {
  const user = getUserById(userId);

  if (!user) {
    return { success: false, message: "ユーザーが見つかりません" };
  }

  return {
    success: true,
    message: `${user.name}さんの注文を受け付けました: ${item}`,
    orderId: `ORD-${userId}-001`,
  };
}

// 割引価格を計算する
function calculateDiscountPrice(userId, price) {
  const user = getUserById(userId);

  if (!user) return price;

  if (user.isPremium) {
    return price * 0.8; // プレミアム会員は20%オフ
  }

  return price * 0.95; // 通常会員は5%オフ
}

module.exports = { processOrder, calculateDiscountPrice };
