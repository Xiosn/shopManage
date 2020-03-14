import { request } from './request';

// 获取菜单列表
export function getMenuList() {
    return request({
        url: '/menus'
    })
}