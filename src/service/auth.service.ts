import {AuthModelPayload} from "@/models";
import {BaseApi} from "@/service/baseApi";

class AuthService extends BaseApi{

    constructor() {
        super();
    }

    async login(authData: AuthModelPayload) {
        return await this._post({
            route: '/auth/login',
            bodyParams: authData,
            needAuth: false,
        })
    }

    async registration(authData: AuthModelPayload) {
        return await this._post({
            route: '/auth/registration',
            bodyParams: authData,
            needAuth: false,
        })
    }

    async logout() {
        return await this._post({
            route: '/auth/logout',
            needAuth: true,
        })
    }

    async refresh() {
        return await this._post({
            route: '/auth/refresh',
            needAuth: true,
        })
    }
}

const service = new AuthService();
export default service;
