// ユーザー情報をDBから取得する（実際の実装はDBアクセスを伴う）
function getUserById(id) {
  // 本来はDBアクセスなどの副作用がある処理
  throw new Error("実際のDB接続が必要です");
}

// ユーザーが管理者かどうかを確認する
function isAdmin(user) {
  return user.role === "admin";
}

// ユーザーのフルネームを取得する
function getFullName(user) {
  return `${user.lastName} ${user.firstName}`;
}

module.exports = { getUserById, isAdmin, getFullName };
