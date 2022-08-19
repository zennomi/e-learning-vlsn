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
    {
        "hàm số": [],
        "hàm số mũ và logarit": [],
        "nguyên hàm và tích phân": [],
        "số phức": [],
        "thể tích khối đa diện": [],
        "thể tích khối tròn xoay": [],
        "oxyz": [],
    } :
    {
        "dao động cơ": [
            "đại cương dao động",
            "tổng hợp dao động",
            "con lắc lò xo",
            "con lắc đơn",
            "các loại dao động",
        ],
        "sóng cơ": [
            "sóng đơn",
            "giao thoa sóng",
            "sóng dừng",
            "sóng âm",
        ],
        "điện xoay chiều": [
            "mạch rlc nối tiếp",
            "bài toán hộp đen",
            "công suất cộng hưởng",
            "giá trị biến thên và cực trị",
            "các loại máy điện",
            "truyền tải điện năng",
        ],
        "mạch lc – sóng điện từ": [
            "mạch lc dao động tự do",
            "sóng điện từ",
        ],
        "sóng ánh sáng": [
            "định luật khúc xạ",
            "đặc điểm sóng ánh sáng",
            "giao thoa ánh sáng",
            "quang phổ và các loạt tia",
        ],
        "lượng tử ánh sáng": [
            "quang điện ngoài",
            "quang điện trong",
            "quang phát quang",
            "mẫu nguyên tử bohr",
        ],
        "hạt nhân": [
            "cấu tạo hạt nhân",
            "phản ứng hạt nhân",
            "phóng xạ",
        ],
        "điện học": [
            "điện tích – điện trường",
            "dòng điện không đổi",
            "dòng điện trong các môi trường",
        ],
        "từ học": [
            "từ trường",
            "cảm ứng điện từ",
        ],
        "quang học": [
            "khúc xạ ánh sáng",
            "mắt và các dụng cụ quang",
        ],
        "động học chất điểm": [
            "chuyển động thẳng đều",
            "chuyển động thẳng biến đổi đều",
            "sự rơi tự do",
            "chuyển động tròn đều",
            "tính tương đối của chuyển động",
            "sai số phép đo",
        ],
        "động lực học chất điểm": [
            "lực và tổng hợp lực",
            "ba định luật newton",
            "các loại lực",
            "chuyển động ném ngang – ném xiên"
        ],
        "cân bằng và chuyển động của chất rắn": [
            "momen lực",
            "các dạng cân bằng của vật",
            "chuyển động của tịnh tiến và chuyển động quay quanh 1 trục cố định",
            "ngẫu lực",
        ],
        "các định luật bảo toàn": [
            "động lượng",
            "công và công suất",
            "cơ năng, thế năng, động năng",
            "ba định luật kepler",
        ],
    }