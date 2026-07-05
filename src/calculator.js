// 外部APIから税率を取得する（実際の実装はAPIアクセスを伴う）
function getTaxRate(region) {
  throw new Error("実際のAPI呼び出しが必要です");
}

// 税込み価格を計算する
function calculateTotalPrice(price, region) {
  const taxRate = getTaxRate(region);
  return price * (1 + taxRate);
}

module.exports = { getTaxRate, calculateTotalPrice };
