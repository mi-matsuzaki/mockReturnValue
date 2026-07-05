/**
 * 【レッスン2】mockReturnValueOnce
 *
 * mockReturnValueOnce(value) は「1回だけ」指定した値を返します。
 * 複数回チェーンすると、呼ばれるたびに異なる値を返せます。
 *
 * mockReturnValue vs mockReturnValueOnce:
 *   - mockReturnValue   → 常に同じ値（デフォルト動作）
 *   - mockReturnValueOnce → 1回だけ（使い切ったら次の Once へ、なければ mockReturnValue の値）
 */

describe("mockReturnValueOnce の使い方", () => {
  // --- 例1: 1回だけ特定の値を返す ---
  test("1回目だけ特定の値を返す", () => {
    const mockFn = jest.fn();

    mockFn.mockReturnValueOnce("最初の値");

    expect(mockFn()).toBe("最初の値");
    expect(mockFn()).toBeUndefined(); // 2回目以降はデフォルト（undefined）
  });

  // --- 例2: 複数回チェーンして呼び出し順に異なる値を返す ---
  test("呼び出しごとに異なる値を返す", () => {
    const mockFn = jest.fn();

    mockFn
      .mockReturnValueOnce("1回目")
      .mockReturnValueOnce("2回目")
      .mockReturnValueOnce("3回目");

    expect(mockFn()).toBe("1回目");
    expect(mockFn()).toBe("2回目");
    expect(mockFn()).toBe("3回目");
    expect(mockFn()).toBeUndefined(); // Once が尽きたらundefined
  });

  // --- 例3: Once + デフォルト値の組み合わせ ---
  test("Once が尽きたらデフォルト値にフォールバック", () => {
    const mockFn = jest.fn();

    mockFn
      .mockReturnValueOnce("特別な値")
      .mockReturnValue("デフォルト"); // Once が尽きた後のデフォルト

    expect(mockFn()).toBe("特別な値"); // 1回目: Once
    expect(mockFn()).toBe("デフォルト"); // 2回目以降: デフォルト
    expect(mockFn()).toBe("デフォルト");
    expect(mockFn()).toBe("デフォルト");
  });

  // --- 例4: 実用例 - ページネーションのシミュレーション ---
  test("ページネーションをシミュレートする", () => {
    const mockFetchPage = jest.fn();

    mockFetchPage
      .mockReturnValueOnce({ items: ["A", "B", "C","E"], hasNext: true })
      .mockReturnValueOnce({ items: ["D", "E", ], hasNext: true })
      .mockReturnValueOnce({ items: ["G"], hasNext: true });

    const page1 = mockFetchPage();
    expect(page1.items).toHaveLength(4);
    expect(page1.hasNext).toBe(true);

    const page2 = mockFetchPage();
    expect(page2.items).toHaveLength(2);

    const page3 = mockFetchPage();
    expect(page3.items).toHaveLength(1);
    expect(page3.hasNext).toBe(true);
  });
});
