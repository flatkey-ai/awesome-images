# Thu Viện Prompt Tạo Ảnh Flatkey

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

Thư viện prompt tạo ảnh sẵn dùng cho marketing, phù hợp với đơn vị bán lại API AI, trang tăng trưởng và onboarding người dùng. Người dùng có thể xem mẫu, sao chép prompt, thay biến, đăng ký Flatkey API key và tạo ảnh qua API tương thích OpenAI.

Lấy API key: <https://flatkey.ai?utm_source=skill>

## Giá Trị

- **Giảm rào cản kích hoạt**: người dùng bắt đầu từ mẫu đã có sẵn, không phải từ ô prompt trống.
- **Tăng chuyển đổi API**: mỗi thẻ mẫu đều dẫn người dùng đến trang đăng ký Flatkey API key.
- **Bao phủ nhiều nhu cầu thương mại**: marketing sản phẩm, ảnh ecommerce, quảng cáo mạng xã hội, infographic, avatar, ảnh chụp màn hình app, game assets và chỉnh sửa ảnh.
- **Hỗ trợ quy trình hàng loạt**: mẫu dùng placeholder `{{variable}}`, dễ thay giá trị trước khi gửi prompt cuối cùng đến API.
- **Dùng được cho marketing content**: phù hợp làm prompt gallery, trang hướng dẫn, landing page hoặc tài liệu onboarding.

## Mẫu Có Sẵn

Thư viện hiện có 12 mẫu prompt tạo ảnh phổ biến:

- Visual hero sản phẩm cao cấp
- Ảnh chính ecommerce nền trắng
- Khung bìa quảng cáo UGC
- Infographic Bento liquid glass
- Thẻ trích dẫn founder
- Bộ avatar đồng nhất phong cách
- Poster screenshot App Store
- Thumbnail YouTube
- Key visual poster sự kiện
- Concept sheet đạo cụ game
- Thay nền nhưng giữ nguyên chủ thể
- Collage Lookbook thời trang

Mỗi mẫu gồm:

- Tiêu đề và trường hợp sử dụng
- Danh mục và model đề xuất
- Biến có thể thay thế
- Nội dung prompt đầy đủ
- Ghi chú dùng API
- Nút sao chép prompt
- Link đăng ký Flatkey API key

## Dùng CLI

Chạy thư viện trực tiếp từ GitHub:

```bash
npx github:flatkey-ai/awesome-images
```

CLI khởi động prompt gallery cục bộ và tự mở trình duyệt. Người dùng không cần cấu hình dự án.

Tùy chọn hữu ích:

```bash
npx github:flatkey-ai/awesome-images --port 5173
npx github:flatkey-ai/awesome-images --no-open
npx github:flatkey-ai/awesome-images --help
```

Lệnh dành cho developer:

```bash
npm install
npm test
npm run build
```

## Luồng Người Dùng

1. Chạy `npx github:flatkey-ai/awesome-images` để mở thư viện prompt.
2. Tìm mẫu theo danh mục hoặc từ khóa.
3. Mở mẫu và sao chép prompt.
4. Thay các biến như `{{product_name}}`, `{{core_benefit}}` hoặc `{{brand_color}}`.
5. Đăng ký Flatkey API key tại <https://flatkey.ai?utm_source=skill>.
6. Gọi API tạo ảnh tương thích OpenAI của Flatkey để tạo ảnh.

## Ví Dụ API

```bash
curl https://api.flatkey.ai/v1/images/generations \
  -H "Authorization: Bearer $FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "final prompt after replacing template variables",
    "size": "1536x1024"
  }'
```

## Cấu Trúc Mẫu

Tất cả mẫu nằm trong [src/prompts.js](src/prompts.js).

Thêm mẫu mới bằng cách thêm object:

```js
{
  id: "unique-template-id",
  title: "Template title",
  category: "product",
  badge: "Hero",
  aspectRatio: "16:9",
  model: "gpt-image-2",
  apiUseCase: "Best-fit API use case.",
  description: "Template description.",
  variables: ["product_name", "core_benefit"],
  prompt: "Create a commercial hero image for {{product_name}}..."
}
```

Sau khi thêm, chạy:

```bash
npm test
```

Validator kiểm tra số lượng mẫu, danh mục, biến, độ dài prompt và link đăng ký Flatkey.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
