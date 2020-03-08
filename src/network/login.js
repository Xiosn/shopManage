import { request } from './request';

export function getLoginData({username, password}) {
    return request({
        url: '/login',
        params: {
            username,
            password
        }
    })
}