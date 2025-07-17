# 📱 Screen: Storage

## 🎯 Mục đích
Màn hình "Storage" hiển thị toàn bộ số lượng bóng người dùng đã tích lũy.  
Mỗi quả bóng được xem là một đơn vị giá trị, xuất hiện như vật thể vật lý bên trong một "lọ chứa".  
Phía trên cùng là bộ đếm tổng số lượng được tính tự động từ giá trị của các quả bóng bên dưới.

---

## 🎨 Màu nền màn hình
- Token: `primary/500`
- HEX: `#3D3F9E`

---

## 🔢 Bộ đếm số lượng (ví dụ: 125 / 1000)

### Tổng số (125):
- Typography: `Display/01/Semi Bold`
- Font: Outfit
- Size/Line-height: 72 / 80
- Màu: `primary/100` (#D5D6EF) – 80% opacity

### Giới hạn (1000):
- Typography: `Display/01/Semi Bold`
- Font: Outfit
- Size/Line-height: 72 / 80
- Màu: `primary/100` (#D5D6EF) – 30% opacity

> Hai phần text dùng chung font style, khác nhau ở opacity để nhấn mạnh phần số đã tích lũy.

---

## ⚪ Bóng hiển thị phía dưới

Sử dụng các `Ball Token` từ component: [component-ball-token.md](./component-ball-token.md)

- Bóng tự do trôi, chạm, rơi trong vùng giới hạn phía dưới màn hình
- Tạo hiệu ứng tương tác vật lý: gravity, collision
- Không có text trong bóng
- Mỗi bóng là 1 item độc lập

---

## 📐 Layout

| Thành phần | Vị trí         | Căn giữa | Padding |
|------------|----------------|----------|---------|
| Bộ đếm     | Top center     | ✅       | Từ trên xuống: ~40px |
| Lọ chứa bóng | Bottom section | ✅       | Không padding – full width |

---

## ⚙️ Kỹ thuật đề xuất

- Toàn bộ bóng nên được render bằng canvas hoặc layer tương thích vật lý (dùng Matter.js/WebGL)
- Bộ đếm nên bind với biến `totalBallValue` được tính từ tổng giá trị các bóng trong hệ thống
- Responsive: text scale theo chiều ngang màn hình, bóng giữ nguyên tỉ lệ

---

## 📌 Ghi chú

- Luôn dùng token từ `design-system-tokens.md`
- Text không dùng hardcode HEX, chỉ dùng token + opacity nếu cần nhấn nhẹ
- Tránh stack overflow khi có quá nhiều bóng: nên giới hạn max số bóng render đồng thời hoặc gom bóng nhỏ lại thành nhóm nếu vượt quá viewport