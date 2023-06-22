// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_ADMIN = '/admin';
const ROOTS_LEARNING = '/hoc-tap';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_LEARNING = {
  root: ROOTS_LEARNING,
  question: {
    root: path(ROOTS_LEARNING, '/cau-hoi'),
    id: path(ROOTS_LEARNING, '/cau-hoi/:id'),
    create: path(ROOTS_LEARNING, '/cau-hoi/them-moi'),
    edit: path(ROOTS_LEARNING, '/cau-hoi/:id/cap-nhat'),
  },
  test: {
    root: path(ROOTS_LEARNING, '/de-thi'),
    id: path(ROOTS_LEARNING, '/de-thi/:id'),
    create: path(ROOTS_LEARNING, '/de-thi/them-moi'),
    autoCreate: path(ROOTS_LEARNING, '/de-thi/tu-tao'),
    do: (id) => path(ROOTS_LEARNING, `/de-thi/${id}/lam`),
    detail: path(ROOTS_LEARNING, '/de-thi/:id/chi-tiet'),
    edit: path(ROOTS_LEARNING, '/de-thi/:id/cap-nhat'),
    pdf: path(ROOTS_LEARNING, '/de-thi/:id/in-pdf'),
  },
}

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  importTest: path(ROOTS_ADMIN, '/nhap-de'),
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
