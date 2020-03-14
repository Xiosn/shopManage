import { request } from './request';


// 用户数据列表请求
export function usersRequest(data) {
    return request.get("/users", {
      params: data
    });
  }
  
  // 用户状态更改请求
  export function userStateRequest(data) {
    return request.put(`/users/${data.id}/state/${data.mg_state}`);
  }
  
  // 添加用户请求
  export function addUserRequest(data) {
    return request.post("/users", data);
  }
  
  // 查询用户数据请求
  export function searchUserRequest(id) {
    return request.get("/users/" + id);
  }
  
  // 修改用户请求
  export function editUserRequest(id, data) {
    return request.put("/users/" + id, {
      email: data.email,
      mobile: data.mobile
    });
  }
  
  // 删除用户请求
  export function deleteUserRequest(id) {
    return request.delete("/users/" + id);
  }
  
  // 获取所有角色列表
  export function getRolesListRequest() {
    return request.get("/roles");
  }
  
  // 确定分配而用户角色
  export function setRoleRequest(userId, rid) {
    return request.put(`/users/${userId}/role`, { rid: rid });
  }