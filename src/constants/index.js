import { PRODUCT_NAME } from '../config';

export * from './facts';

export const TEST_TAG_OPTION = [
    "kiểm tra 15 phút",
    "kiểm tra cuối chương",
    "kiểm tra đầu vào",
    "luyện tập",
    "kiểm tra bù",
    "chuyên đề",
    "livestream",
    "ôn thi giữa kỳ",
    "ôn thi cuối kỳ",
    "thi thử",
    "lý thuyết"
]

export const QUESTION_TAG_OPTION = PRODUCT_NAME === "tct" ?
    [
        "hàm số",
        "hàm số mũ và logarit",
        "nguyên hàm và tích phân",
        "số phức",
        "thể tích khối đa diện",
        "thể tích khối tròn xoay",
        "oxyz",
    ] :
    [
        "Dao Động Cơ",
        "Dao Động Điều Hòa",
        "Dao Động Tắt Dần",
        "Dao Động Cưỡng Bức",
        "Con Lắc Lò Xo",
        "Con Lắc Đơn",
        "Tổng Hợp Dao Động",
        "Các Loại Dao Động",
        "Phương Trình Dao Động",
        "Sóng Cơ Và Sóng Âm",
        "Sóng Cơ",
        "Giao Thoa Sóng",
        "Sóng Dừng",
        "Sóng Âm",
        "Dòng Điện Xoay Chiều",
        "Máy Biến Áp",
        "Mạch Điện Xoay Chiều",
        "RLC Mắc Nối Tiếp",
        "Bài Toán Hộp Đen"
    ]