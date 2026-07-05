/**
 * 【レッスン5】mockReturnValue vs mockImplementation の違い
 *
 * - mockReturnValue(v)       → 常に v を返す（シンプル）
 * - mockImplementation(fn)   → 引数に応じて動的に値を返せる（柔軟）
 *
 * 使い分けの目安:
 *   - 引数に関係なく固定値を返したい → mockReturnValue
 *   - 引数によって返す値を変えたい   → mockImplementation
 */

describe("mockReturnValue vs mockImplementation", () => {
  // --- mockReturnValue: 引数を無視して固定値を返す ---
  test("mockReturnValue は引数を無視する", () => {
    const mockMultiply = jest.fn().mockReturnValue(100);

    // どんな引数を渡しても 100 が返る
    expect(mockMultiply(2, 3)).toBe(100);
    expect(mockMultiply(5, 10)).toBe(100);
    expect(mockMultiply(0, 0)).toBe(100);
  });

  // --- mockImplementation: 引数を使って動的に返す ---
  test("mockImplementation は引数を使って計算できる", () => {
    const mockMultiply = jest.fn().mockImplementation((a, b) => a * b);

    expect(mockMultiply(2, 3)).toBe(6);
    expect(mockMultiply(5, 10)).toBe(50);
    expect(mockMultiply(0, 0)).toBe(0);
  });

  // --- 実用例: 条件分岐が必要な場合は mockImplementation ---
  test("getUserById: IDによって異なるユーザーを返す", () => {
    const mockGetUserById = jest.fn().mockImplementation((id) => {
      const users = {
        1: { id: 1, name: "Alice", role: "admin" },
        2: { id: 2, name: "Bob", role: "user" },
      };
      return users[id] || null;
    });

    expect(mockGetUserById(1).name).toBe("Alice");
    expect(mockGetUserById(2).role).toBe("user");
    expect(mockGetUserById(99)).toBeNull();
  });

  // --- どちらも .mockReturnValue チェーンで上書きできる ---
  test("mockImplementation の後に mockReturnValue で上書きできる", () => {
    const mockFn = jest
      .fn()
      .mockImplementation((x) => x * 2)
      .mockReturnValue(999); // これが優先される

    expect(mockFn(5)).toBe(999); // mockImplementation の 10 ではない
  });

  // --- まとめ比較表 ---
  test("使い分けのまとめ", () => {
    // シナリオ: テスト用に「常に同じ値」が欲しい
    const fixedMock = jest.fn().mockReturnValue({ status: "ok" });
    expect(fixedMock("any", "args")).toEqual({ status: "ok" });

    // シナリオ: 引数によって結果を変えたい
    const dynamicMock = jest
      .fn()
      .mockImplementation((input) =>
        input > 0 ? "正" : input < 0 ? "負" : "ゼロ"
      );
    expect(dynamicMock(1)).toBe("正");
    expect(dynamicMock(-1)).toBe("負");
    expect(dynamicMock(0)).toBe("ゼロ");
  });
});
