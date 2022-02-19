// components
import Iconify from '../../../components/Iconify';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
// ----------------------------------------------------------------------



const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general v3.0.0',
    items: [
      { title: 'Câu hỏi', path: PATH_LEARNING.question.root, icon: <Iconify icon="eva:question-mark-circle-fill" /> },
      { title: 'Đề thi', path: PATH_LEARNING.test.root, icon:  <Iconify icon="eva:file-text-fill" /> },
      { title: 'Khoá học', path: PATH_LEARNING.course.root, icon: <Iconify icon="fluent:hat-graduation-12-filled" /> },
    ],
  },
];

export default sidebarConfig;
