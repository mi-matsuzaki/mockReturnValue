/**
 * 【レッスン6】実践的なユースケース
 *
 * 実際のプロジェクトでよく使うパターンをまとめています。
 */

describe("実践的なパターン", () => {
  // --- パターン1: beforeEach でモックをセットアップ ---
  describe("パターン1: beforeEach でのセットアップ", () => {
    let mockLogger;

    beforeEach(() => {
      mockLogger = {
        info: jest.fn().mockReturnValue(undefined),
        error: jest.fn().mockReturnValue(undefined),
        warn: jest.fn().mockReturnValue(undefined),
      };
    });

    test("ログが正しく呼ばれる", () => {
      function doSomething(logger) {
        logger.info("処理開始");
        logger.info("処理終了");
      }

      doSomething(mockLogger);

      expect(mockLogger.info).toHaveBeenCalledTimes(2);
      expect(mockLogger.info).toHaveBeenNthCalledWith(1, "処理開始");
      expect(mockLogger.info).toHaveBeenNthCalledWith(2, "処理終了");
    });
  });

  // --- パターン2: スパイ（spyOn）と mockReturnValue の組み合わせ ---
  describe("パターン2: jest.spyOn + mockReturnValue", () => {
    test("既存オブジェクトのメソッドをスパイする", () => {
      const calculator = {
        add: (a, b) => a + b,
        multiply: (a, b) => a * b,
      };

      // spyOn: 元の実装を保持しつつモニタリング
      const spy = jest.spyOn(calculator, "add").mockReturnValue(99);

      expect(calculator.add(1, 2)).toBe(99); // モックされた値
      expect(spy).toHaveBeenCalledWith(1, 2);

      // モックを解除すると元の実装に戻る
      spy.mockRestore();
      expect(calculator.add(1, 2)).toBe(3); // 元の実装
    });
  });

  // --- パターン3: 複数のモックを組み合わせる ---
  describe("パターン3: 複数モックの組み合わせ", () => {
    test("依存関係をすべてモックしてユニットテスト", () => {
      const mockDb = {
        query: jest.fn().mockReturnValue([
          { id: 1, product: "りんご", quantity: 3 },
          { id: 2, product: "みかん", quantity: 5 },
        ]),
      };

      const mockEmailService = {
        send: jest.fn().mockReturnValue({ sent: true }),
      };

      // テスト対象の関数
      function generateAndSendReport(db, emailService, recipient) {
        const items = db.query("SELECT * FROM inventory");
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        emailService.send(recipient, `在庫合計: ${total}個`);
        return total;
      }

      const total = generateAndSendReport(
        mockDb,
        mockEmailService,
        "manager@example.com"
      );

      expect(total).toBe(8);
      expect(mockDb.query).toHaveBeenCalledWith("SELECT * FROM inventory");
      expect(mockEmailService.send).toHaveBeenCalledWith(
        "manager@example.com",
        "在庫合計: 8個"
      );
    });
  });

  // --- パターン4: モックのリセット方法 ---
  describe("パターン4: モックのリセット", () => {
    const mockFn = jest.fn();

    test("1回目のテスト", () => {
      mockFn.mockReturnValue("テスト1の値");
      expect(mockFn()).toBe("テスト1の値");
    });

    test("mockClear: 呼び出し履歴だけクリア", () => {
      mockFn.mockClear(); // 履歴はリセット、mockReturnValue の設定は残る
      expect(mockFn).toHaveBeenCalledTimes(0);
      // 注意: mockReturnValue の設定は残っている
    });

    test("mockReset: 設定も含めてリセット", () => {
      mockFn.mockReturnValue("新しい値");
      mockFn.mockReset(); // すべてリセット（mockReturnValue の設定も消える）
      expect(mockFn()).toBeUndefined(); // デフォルトの undefined に戻る
    });
  });
});
