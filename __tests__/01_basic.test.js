/**
 * 【レッスン1】mockReturnValue の基本
 *
 * mockReturnValue(value) は、モック関数が呼ばれたとき
 * 常に同じ値を返すように設定するメソッドです。
 */

describe("mockReturnValue の基本", () => {
  // --- 例1: jest.fn() で作ったモック関数に使う ---
  test("モック関数が指定した値を返す", () => {
    const mockGetName = jest.fn();

    // 「この関数を呼んだら 'Alice' を返す」と設定
    mockGetName.mockReturnValue("Alice");

    expect(mockGetName()).toBe("Alice");
    expect(mockGetName()).toBe("Alice"); // 何度呼んでも同じ値
    expect(mockGetName()).toBe("Alice");
  });

  // --- 例2: オブジェクトを返す ---
  test("オブジェクトを返すモック", () => {
    const mockGetUser = jest.fn();

    mockGetUser.mockReturnValue({
      id: 1,
      name: "田中太郎",
      role: "admin2",
      aho: true,
    });

    const user = mockGetUser();
    expect(user.name).toBe("田中太郎");
    expect(user.role).toBe("admin2");
    expect(user.aho).toBe(true);
  });

  // --- 例3: undefined / null / false を返す ---
  test("falsy な値も返せる", () => {
    const mockFn = jest.fn();

    mockFn.mockReturnValue(null);
    expect(mockFn()).toBeNull();

    mockFn.mockReturnValue(true);
    expect(mockFn()).toBe(true);

    mockFn.mockReturnValue(1);
    expect(mockFn()).toBe(1);
  });

  // --- 例4: 何回呼ばれたか確認する ---
  test("呼び出し回数を確認できる", () => {
    const mockFn = jest.fn().mockReturnValue(42);

    mockFn();
    mockFn();
    mockFn();
    mockFn();

    expect(mockFn).toHaveBeenCalledTimes(4);
    expect(mockFn()).toBe(42); // 4回目も同じ値
  });
});
