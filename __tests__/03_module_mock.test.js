/**
 * 【レッスン3】モジュール全体をモックする
 *
 * jest.mock() でモジュールをモックし、
 * その関数に mockReturnValue を適用する方法です。
 *
 * これにより、DBアクセスやAPI呼び出しなどの副作用を
 * テスト中に差し替えられます。
 */

// jest.mock() はファイルの先頭（importより前）に書く必要がある
jest.mock("../src/userService");

const { getUserById, isAdmin, getFullName } = require("../src/userService");
const { processOrder, calculateDiscountPrice } = require("../src/orderService");

describe("モジュールモックと mockReturnValue", () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 例1: モジュールの関数をモックして別モジュールのテスト ---
  test("getUserById がユーザーを返すとき、processOrder が成功する", () => {
    // getUserById をモックして特定のユーザーを返すよう設定
    getUserById.mockReturnValue({
      id: 1,
      name: "山田花子",
      isPremium: false,
    });

    const result = processOrder(1, "ノートPC");

    expect(result.success).toBe(true);
    expect(result.message).toContain("山田花子");
    expect(result.message).toContain("ノートPC");
    expect(getUserById).toHaveBeenCalledWith(1); // 引数の確認
  });

  // --- 例2: null を返してエラーケースをテスト ---
  test("getUserById が null を返すとき、processOrder が失敗する", () => {
    getUserById.mockReturnValue(null);

    const result = processOrder(999, "商品");

    expect(result.success).toBe(false);
    expect(result.message).toBe("ユーザーが見つかりません");
  });

  // --- 例3: プレミアム会員の割引テスト ---
  test("プレミアム会員は20%オフになる", () => {
    getUserById.mockReturnValue({
      id: 2,
      name: "プレミアム会員",
      isPremium: true,
    });

    const discountPrice = calculateDiscountPrice(2, 1000);
    expect(discountPrice).toBe(800); // 1000 × 0.8
  });

  // --- 例4: 通常会員の割引テスト ---
  test("通常会員は5%オフになる", () => {
    getUserById.mockReturnValue({
      id: 3,
      name: "通常会員",
      isPremium: false,
    });

    const discountPrice = calculateDiscountPrice(3, 1000);
    expect(discountPrice).toBe(950); // 1000 × 0.95
  });

  // --- 例5: isAdmin と getFullName のテスト ---
  test("isAdmin は user.role を見て判定する", () => {
    // isAdmin はモジュールのモックなので自動でモックされている
    // 元の実装をそのまま使いたい場合は mockImplementation で元に戻す
    isAdmin.mockImplementation((user) => user.role === "admin");

    expect(isAdmin({ role: "admin" })).toBe(true);
    expect(isAdmin({ role: "user" })).toBe(false);
  });
});
