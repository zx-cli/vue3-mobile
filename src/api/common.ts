import request from '@/utils/request';


// 获取企业列表
export function fetchCorpByName(name: string) {
  return request.get(`/zqjh/api/center/wybx/getCorpByName/${name}`);
}

// 附件上传
export function uploadFile(file: any) {
  const data = new FormData();
  data.append('file', file);
  return request.post('/uaa/api/upload/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 登录
export function login(data: any) {
  return request.post('/uaa/login', data);
}
