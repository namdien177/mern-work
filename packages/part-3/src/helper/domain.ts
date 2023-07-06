import { environment } from '../environments/environment';

export const API_DOMAIN = (path: TemplateStringsArray) => {
  const relativePath = path.raw.join('');
  const envAPIHost = environment.api_host;
  const url = new URL(
    `/api${relativePath.startsWith('/') ? '' : '/'}${relativePath}`,
    envAPIHost
  );
  return url.toString();
};
