import { request } from './request';

// 获取权限列表数据
export function getRightsRequest() {
  return request.get("/rights/list");
}

// 获取角色列表数据
export function getRolesRequest() {
  return request.get("/roles");
}

// 根据ID删除对应的权限
export function deleteRightsRequest(row, id) {
  return request.delete(`/roles/${row.id}/rights/${id}`);
}

// 获取所有权限数据
export function getAdminRequest() {
  return request.get("/rights/tree");
}

// 确定分配权限数据
export function setAdminRequest(id, str) {
  return request.post(`/roles/${id}/rights`, { rids: str });
}

// 添加角色请求
export function addRolesRequest(data) {
  return request.post("/roles", data);
}

// 修改角色请求
export function editRolesRequest(id, data) {
  return request.put("/roles/" + id, data);
}

// 删除角色请求
export function deleteRolesRequest(id) {
  return request.delete("/roles/" + id);
}

// 根据ID查询角色
export function searchRolesRequest(id) {
  return request.get("/roles/" + id);
}
