# ⚪ Visual Token: Ball (Storage Version)

## 🧭 Mô tả
`Ball Token` là một hình tròn **không tương tác**, được sử dụng trong màn hình **Kho lưu trữ** của ứng dụng.  
Chức năng của nó là đại diện cho số lượng bóng người dùng đang sở hữu, xuất hiện như các vật thể trong một "lọ chứa" ảo.

Các bóng này sẽ:
- **Nghiêng, trôi, rơi** dựa trên cảm biến trọng lực (gravity sensor) của thiết bị.
- Không cần xử lý input, không có animation riêng – chỉ là visual token phục vụ hệ thống vật lý hiển thị.
- Được render động trong 1 vùng container có giới hạn va chạm và phản lực.

---

## 📐 Kích thước & Thiết kế

| Nhóm màu         | Kích thước  | Fill Token         | Fill HEX   | Stroke Token       | Stroke HEX | Stroke Position | Stroke Weight | Radius |
|------------------|-------------|--------------------|------------|---------------------|------------|------------------|----------------|--------|
| Secondary (2, 5) | 28 x 28 px  | secondary/500      | #41DBD8    | secondary/600       | #22B3B0    | Inside           | 1px            | 50%    |
| Territory 1 (10, 15) | 34 x 34 px  | territory1/500     | #FFB800    | territory1/600      | #D59900    | Inside           | 1px            | 100    |
| Territory 2 (20) | 40 x 40 px  | territory2/500     | #F14878    | territory2/600      | #DA114A    | Inside           | 1px            | 100    |

---

## 🧠 Đặc điểm hành vi

- Không chứa text hoặc icon bên trong.
- Mỗi quả bóng là một entity độc lập, có thể va chạm và chịu ảnh hưởng bởi trọng lực.
- Khi thiết bị nghiêng, bóng sẽ rơi theo độ nghiêng, tương tự như hiệu ứng physics trong game 2D.
- Có thể gom vào trong 1 container layout dạng "lọ" (dạng hình chữ nhật hoặc oval, bo góc).

---

## 📦 Triển khai đề xuất

- Nên sử dụng thư viện như: Matter.js, PhysicsJS hoặc WebGL đơn giản để xử lý va chạm & lực.
- Tách riêng từng nhóm theo loại bóng để gán class/màu tương ứng.
- Tất cả style phải lấy từ `design-system-tokens.md`, không hardcode.

---

## ✅ Token liên quan

- Fill: `secondary/500`, `territory1/500`, `territory2/500`
- Stroke: `secondary/600`, `territory1/600`, `territory2/600`
- Kích thước: 28px / 34px / 40px
- Border Radius: 50%–100% (tuỳ nhóm)