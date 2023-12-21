import {BaseApi} from "@/service/baseApi";

class UserService extends BaseApi {

    constructor() {
        super();
    }

    async getCurrentUser() {
        return await this._get({
            route: '/users/current',
            needAuth: true,
        })
    }
}

const service = new UserService();
export default service;
