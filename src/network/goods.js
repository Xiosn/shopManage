import { request } from "./request";

// 获取商品分类数据
export function getGoodsRequest(data) {
  return request.get("/categories", { params: data });
}

// 获取父级分类数据列表
export function getCateRequest() {
  return request.get("/categories", {
    params: {
      type: 2
    }
  });
}

// 添加分类
export function addCateRequest(data) {
  return request.post("/categories", data);
}

// 根据id查询分类
export function searchCateRequest(id) {
  return request.get("/categories/" + id);
}

// 根据ID修改分类
export function editCateRequest(id, name) {
  return request.put("/categories/" + id, { cat_name: name });
}

// 根据ID删除分类
export function deleteCateRequest(id) {
  return request.delete("/categories/" + id);
}

// 获取所有商品分类
export function getAllGoodsRequest() {
  return request.get("/categories");
}

// 根据所选分类的ID跟当前所处的面板获取对应的数据
export function getPanelRequest(catId, name) {
  return request.get(`/categories/${catId}/attributes`, {
    params: {
      sel: name
    }
  });
}

// 确定添加参数请求
export function realAddParamsRequest(catId, attr_name, activeName) {
  return request.post(`/categories/${catId}/attributes`, {
    attr_name: attr_name,
    attr_sel: activeName
  });
}

// 确定修改参数请求
export function realEditParamsRequest(catId, attrId, attr_name, activeName) {
  return request.put(`/categories/${catId}/attributes/${attrId}`, {
    attr_name: attr_name,
    attr_sel: activeName
  });
}

// 删除参数请求
export function deleteParams(catId, id) {
  return request.delete(`/categories/${catId}/attributes/${id}`);
}

// 修改标签请求
export function editTagRequest(catId, attr_id, attr_name, attr_sel, attr_vals) {
  return request.put(`/categories/${catId}/attributes/${attr_id}`, {
    attr_name: attr_name,
    attr_sel: attr_sel,
    attr_vals: attr_vals.join(" ")
  });
}

// 获取商品列表
export function getGoodsListRequest(queryInfo) {
  return request.get("/goods", {
    params: queryInfo
  });
}

// 删除商品数据
export function deleteGoodsDataRequest(id) {
  return request.delete("/goods/" + id);
}

// 添加商品数据
export function addGoodsDataRequest(form) {
  return request.post("/goods", form);
}

// 修改商品数据
export function editGoodsDataRequest(id, form) {
  return request.put("/goods/" + id, form);
}

// 根据ID查询商品
export function searchGoodsByIdRequest(id) {
  return request.get("/goods/" + id);
}
