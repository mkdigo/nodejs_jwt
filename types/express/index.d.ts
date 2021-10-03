declare namespace Express {
  interface Request {
    authUser: import('@prisma/client').User;
  }
}
