# 🧩 Component: SpinBall

## 🔹 Mô tả

`SpinBall` là component dạng hình tròn, chứa số đếm bên trong (2, 5, 10, 15, 20).  
Đây là một trong các component sử dụng lặp lại nhiều nhất trong hệ thống, đại diện cho các mốc giá trị thưởng – số vòng quay – hoặc token tương tác trong game.

---

## 🎨 Style chi tiết

### Typography:
- **Style**: `Heading/H6/Semi Bold`
- **Font**: Outfit
- **Size/LineHeight**: 19/23
- Được định nghĩa sẵn trong file `design-system-tokens.md`

---

### Màu sắc theo từng loại bóng:

| Value | Fill Token        | Fill HEX | Stroke Token       | Stroke HEX | Text Color    |
|-------|-------------------|----------|---------------------|------------|---------------|
| 2     | secondary/500     | #41DBD8  | secondary/600       | #22B3B0    | neutral/50    |
| 5     | secondary/500     | #41DBD8  | secondary/600       | #22B3B0    | neutral/50    |
| 10    | territory1/500    | #FFB800  | territory1/600      | #D59900    | neutral/50    |
| 15    | territory1/500    | #FFB800  | territory1/600      | #D59900    | neutral/50    |
| 20    | territory2/500    | #F14878  | territory2/600      | #DA114A    | neutral/50    |

- **Stroke weight**: 1px  
- **Stroke position**: Inside  
- **Border radius**: 50% (hình tròn hoàn chỉnh)

---


> (Kích thước có thể được xác định bằng prop `size = 'large' | 'small'` nếu cần tái sử dụng linh hoạt)

---

## ⚙️ API đề xuất

```ts
interface SpinBallProps {
  value: 2 | 5 | 10 | 15 | 20
  size?: 'large' | 'small' // default: large
}
```

---

## 📦 Cách dùng

```jsx
<SpinBall value={10} />
<SpinBall value={2} size="small" />
```

---

## 📌 Ghi chú:

- **KHÔNG hardcode màu hoặc font**, luôn gọi từ token hệ thống (`design-system-tokens.md`)
- Component này nên được đưa vào thư viện UI nội bộ (`ui/spinball`) để dễ tái sử dụng.
- Có thể mở rộng để thêm animation, tooltip, trạng thái disabled nếu cần.

---

## 📐 Kích thước chi tiết

### Large Ball (default):
- Width: 56px
- Height: 56px
- Gap giữa các ball: 10px
- Padding: Top-Bottom: 20px, Left-Right: 11px
- Alignment: Center (Cả chiều ngang và dọc)



> Nếu có sự thay đổi padding/gap/align trong từng context, nên tạo biến thể riêng hoặc ghi đè trong layout màn hình cụ thể.