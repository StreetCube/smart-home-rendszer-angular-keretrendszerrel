import { HttpInterceptorFn } from '@angular/common/http';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldPrepend = !req.url.startsWith('/api') && !req.url.startsWith('/i18n');
  const apiReq = shouldPrepend ? req.clone({ url: `/api${req.url}` }) : req;

  return next(apiReq);
};
