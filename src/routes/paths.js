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
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
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
    do: path(ROOTS_LEARNING, '/de-thi/:id/lam'),
    detail: path(ROOTS_LEARNING, '/de-thi/:id/chi-tiet'),
    edit: path(ROOTS_LEARNING, '/de-thi/:id/cap-nhat'),
    pdf: path(ROOTS_LEARNING, '/de-thi/:id/in-pdf'),
  },
  video: {
    root: path(ROOTS_LEARNING, '/bai-giang'),
    id: path(ROOTS_LEARNING, '/bai-giang/:id'),
    create: path(ROOTS_LEARNING, '/bai-giang/them-moi'),
    edit: path(ROOTS_LEARNING, '/bai-giang/:id/cap-nhat'),
  },
  course: {
    root: path(ROOTS_LEARNING, '/khoa-hoc'),
    view: (id) => path(ROOTS_LEARNING, `/khoa-hoc/${id}`),
    part: (id, part) => path(ROOTS_LEARNING, `/khoa-hoc/${id}/${part}`),
    create: path(ROOTS_LEARNING, '/khoa-hoc/them-moi'),
    edit: (id) => path(ROOTS_LEARNING, `/khoa-hoc/${id}/cap-nhat`),
  }
}

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
  checkout: '/thanh-toan',
  deposit: '/nap-tien',
};

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  verifyDeposit: path(ROOTS_ADMIN, '/xac-nhan-nap-tien'),
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
