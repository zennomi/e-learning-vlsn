// components
import Iconify from '../../../components/Iconify';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
// ----------------------------------------------------------------------



const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'E-Learning VLSN v1.3.0',
    items: [
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
    ],
  },
];

export default sidebarConfig;
