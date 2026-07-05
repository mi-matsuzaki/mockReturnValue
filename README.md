# mockReturnValue 学習プロジェクト

Jest の `mockReturnValue` を体系的に学ぶためのプロジェクトです。

## セットアップ

```bash
npm install
```

## テストの実行

```bash
npm test              # 全テスト実行
npm run test:verbose  # 詳細出力
npm run test:watch    # ウォッチモード（ファイル変更で自動再実行）
```

---

## レッスン一覧

### レッスン1: 基本 (`__tests__/01_basic.test.js`)
`mockReturnValue` の最も基本的な使い方。

```js
const mockFn = jest.fn();
mockFn.mockReturnValue("Alice");

mockFn(); // → "Alice"
mockFn(); // → "Alice"（何度呼んでも同じ）
```

---

### レッスン2: mockReturnValueOnce (`__tests__/02_mockReturnValueOnce.test.js`)
1回だけ特定の値を返す。チェーンで呼び出しごとに異なる値を設定できる。

```js
const mockFn = jest.fn();
mockFn
  .mockReturnValueOnce("1回目")
  .mockReturnValueOnce("2回目")
  .mockReturnValue("デフォルト");  // Once が尽きた後

mockFn(); // → "1回目"
mockFn(); // → "2回目"
mockFn(); // → "デフォルト"
```

---

### レッスン3: モジュールモック (`__tests__/03_module_mock.test.js`)
`jest.mock()` でモジュールをモックし、DBアクセスなどの副作用を差し替える。

```js
jest.mock("../src/userService");
const { getUserById } = require("../src/userService");

getUserById.mockReturnValue({ id: 1, name: "田中太郎" });
```

---

### レッスン4: 非同期モック (`__tests__/04_mockResolvedValue.test.js`)
Promiseを返す非同期関数のモック。

| メソッド | 用途 |
|---|---|
| `mockResolvedValue(v)` | `Promise.resolve(v)` を返す |
| `mockRejectedValue(e)` | `Promise.reject(e)` を返す |
| `mockResolvedValueOnce(v)` | 1回だけ resolve |
| `mockRejectedValueOnce(e)` | 1回だけ reject |

```js
mockFetch.mockResolvedValue({ status: 200 });
const result = await mockFetch(); // → { status: 200 }
```

---

### レッスン5: vs mockImplementation (`__tests__/05_comparison.test.js`)
使い分けの目安:

| 状況 | 使うメソッド |
|---|---|
| 引数に関係なく固定値を返したい | `mockReturnValue` |
| 引数によって返す値を変えたい | `mockImplementation` |

```js
// 固定値
jest.fn().mockReturnValue(100);

// 動的
jest.fn().mockImplementation((a, b) => a * b);
```

---

### レッスン6: 実践パターン (`__tests__/06_practical.test.js`)
- `beforeEach` でのセットアップ
- `jest.spyOn` との組み合わせ
- 複数モックの組み合わせ
- モックのリセット方法（`mockClear` / `mockReset` / `mockRestore`）

---

## モックのリセット方法まとめ

| メソッド | 呼び出し履歴 | mockReturnValue 設定 | 元の実装 |
|---|---|---|---|
| `mockClear()` | リセット | 残る | 残る |
| `mockReset()` | リセット | リセット | 残る |
| `mockRestore()` | リセット | リセット | 元に戻る（spyOn のみ）|
