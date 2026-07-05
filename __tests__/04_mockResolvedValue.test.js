/**
 * 【レッスン4】非同期関数のモック
 *
 * Promiseを返す非同期関数には専用のメソッドを使います:
 *   - mockResolvedValue(value)     → Promise.resolve(value) を返す
 *   - mockRejectedValue(error)     → Promise.reject(error) を返す
 *   - mockResolvedValueOnce(value) → 1回だけ resolve
 *   - mockRejectedValueOnce(error) → 1回だけ reject
 */

// 非同期でユーザーを取得する関数（実際はAPIを呼ぶ）
async function fetchUser(id) {
  throw new Error("実際のAPI呼び出しが必要です");
}

// fetchUser に依存するサービス
async function getUserProfile(id) {
  const user = await fetchUser(id);
  return {
    displayName: `${user.name}（${user.age}歳）`,
    isAdult: user.age >= 18,
  };
}

describe("非同期モック: mockResolvedValue / mockRejectedValue", () => {
  // --- 例1: mockResolvedValue の基本 ---
  test("mockResolvedValue は Promise.resolve を返す", async () => {
    const mockFetchData = jest.fn();

    mockFetchData.mockResolvedValue({ data: "成功データ" });

    const result = await mockFetchData();
    expect(result.data).toBe("成功データ");
  });

  // --- 例2: mockRejectedValue でエラーケースをテスト ---
  test("mockRejectedValue は Promise.reject を返す", async () => {
    const mockFetchData = jest.fn();

    mockFetchData.mockRejectedValue(new Error("ネットワークエラー"));

    await expect(mockFetchData()).rejects.toThrow("ネットワークエラー");
  });

  // --- 例3: 成功→失敗の順番をシミュレート ---
  test("1回目は成功、2回目は失敗する", async () => {
    const mockFetch = jest.fn();

    mockFetch
      .mockResolvedValueOnce({ status: 200, data: "OK" })
      .mockRejectedValueOnce(new Error("タイムアウト"));

    const first = await mockFetch();
    expect(first.status).toBe(200);

    await expect(mockFetch()).rejects.toThrow("タイムアウト");
  });

  // --- 例4: リトライロジックのテスト ---
  test("2回失敗して3回目に成功するリトライのテスト", async () => {
    const mockApi = jest.fn();

    mockApi
      .mockRejectedValueOnce(new Error("1回目失敗"))
      .mockRejectedValueOnce(new Error("2回目失敗"))
      .mockResolvedValueOnce({ result: "3回目で成功" });

    // リトライ関数
    async function withRetry(fn, maxRetries) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (err) {
          if (i === maxRetries - 1) throw err;
        }
      }
    }

    const result = await withRetry(mockApi, 3);
    expect(result.result).toBe("3回目で成功");
    expect(mockApi).toHaveBeenCalledTimes(3);
  });
});
