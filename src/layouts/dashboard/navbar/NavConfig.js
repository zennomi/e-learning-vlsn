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
      { title: 'Khoá học', path: PATH_LEARNING.course.root, icon: <Iconify icon="fluent:hat-graduation-12-filled" /> },
      {
        title: 'Câu hỏi',
        path: PATH_LEARNING.question.root,
        icon: <Iconify icon="eva:question-mark-circle-fill" />,
        children: [
          {
            title: 'Khối 12',
            path: `${PATH_LEARNING.question.root}?grade=12`,
          },
          {
            title: 'Khối 11',
            path: `${PATH_LEARNING.question.root}?grade=11`,
          },
          {
            title: 'Khối 10',
            path: `${PATH_LEARNING.question.root}?grade=10`,
          },
        ]
      },
      {
        title: 'Đề thi',
        path: PATH_LEARNING.test.root, icon: <Iconify icon="eva:file-text-fill" />,
        children: [
          {
            title: 'Khối 12',
            path: `${PATH_LEARNING.test.root}?grade=12`,
          },
          {
            title: 'Khối 11',
            path: `${PATH_LEARNING.test.root}?grade=11`,
          },
          {
            title: 'Khối 10',
            path: `${PATH_LEARNING.test.root}?grade=10`,
          },
        ]
      },
      {
        title: 'Bài giảng',
        path: PATH_LEARNING.video.root, icon: <Iconify icon="eva:video-fill" />
      },
    ],
  },
];

export default sidebarConfig;
