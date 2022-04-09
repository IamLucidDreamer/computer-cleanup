// eslint-disable-next-line
import wretch from 'wretch';
import { config } from '../common/configs';

const { baseUrl } = config;

const wretchReq = wretch(baseUrl, { credentials: 'include' });

export async function request(url, method, props = {}) {
  const { data, headers, formData, options } = props;
  // const formDataObj = new FormData()
  let replaceUrl = false;
  if (url.startsWith('http')) {
    replaceUrl = true;
  }
  let req = wretchReq.url(url, replaceUrl);

  if (headers) {
    req = req.headers(headers);
  }
  if (formData) {
    // const form = new FormData();
    // form.append('files', formData.file);
    req = req.formData(formData);
  }
  if (options) {
    req = req.options({
      ...options,
      credentials: 'include',
    });
  }
  req = req
    .catcher(404, (err) => {
      throw err;
    })
    .catcher(500, (err) => {
      // eslint-disable-next-line no-console
      console.log('Server Error: ', err);
      throw err;
    });
  let reqObj;
  switch (method) {
    case 'GET':
      reqObj = req.get();
      break;
    case 'POST':
      if (data) {
        reqObj = req.post(data);
      } else {
        reqObj = req.post();
      }
      break;
    case 'PUT':
      if (data) {
        reqObj = req.put(data);
      } else {
        reqObj = req.put();
      }
      break;
    case 'PATCH':
      if (data) {
        reqObj = req.patch(data);
      } else {
        reqObj = req.patch();
      }
      break;
    case 'DELETE':
      reqObj = req.delete();
      break;
    default:
      reqObj = req.get();
  }
  // reqObj.res().then((res) => {
  //   console.log(res.headers);
  //   if (res.headers) {
  //     const tokenInfo = res.headers.get('Authentication');
  //     if (tokenInfo) {
  //       setToken(tokenInfo);
  //     }
  //   }
  // });
  if (method === 'DELETE' || method === 'PUT' || method === 'PATCH') {
    return reqObj;
  }
  return reqObj.json((res) => res);
}
