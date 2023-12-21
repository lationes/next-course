import AuthService from "@/service/auth.service";
import useAuthStore from "../store/AuthStore";
type AllowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface AllowedMethodsObj {
    [prop: string]: AllowedMethods
}

interface MethodArguments {
    route: string;
    bodyParams?: any;
    needAuth: boolean;
    headers?: any;
    isFormData?: boolean;
}

interface RequestArguments extends MethodArguments {
    method: AllowedMethods;
}

interface FetchConfig {
    method: AllowedMethods;
    headers: any;
    body: any;
}

interface FetchErrorModel {
    response: Response;
    config: FetchConfig;
    route: string;
    fetchUrl: string;
}

export class BaseApi {
    private _methods: AllowedMethodsObj = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
    };

    private baseApiUrl = process.env.API_PATH;

    private _isMethodExist(method: AllowedMethods) {
        switch (method) {
            case this._methods.GET:
                return true;
            case this._methods.POST:
                return true;
            case this._methods.PUT:
                return true;
            case this._methods.DELETE:
                return true;
            default:
                return false;
        }
    }

    private async _requestErrorHandler({ response, config, route, fetchUrl}: FetchErrorModel) {
        if (response.status === 401 && !route.includes('refresh')) {
            const refreshResponse = await AuthService.refresh();
            const parsedRefreshResponse = await refreshResponse.json();

            if (!response.ok) {
                useAuthStore.getState().deleteAccessToken();
                throw parsedRefreshResponse;
            }

            const { accessToken } = parsedRefreshResponse;
            useAuthStore.getState().setAccessToken(accessToken);

            config.headers = { ...config.headers, 'Authorization': `Bearer ${accessToken}` };

            const retryResponse = await fetch(fetchUrl, config);

            return await retryResponse.json();
        }

        if (route.includes('refresh') && !response.ok) {
            return response;
        }

        const parsedErrorResponse = await response.json();
        console.log(parsedErrorResponse)
        throw parsedErrorResponse;
    }

    async _getRequest({ method, route, bodyParams, needAuth = false, headers = {}, isFormData = false}: RequestArguments) {
        try {
            const fetchUrl =  this.baseApiUrl + route;

            const config: FetchConfig = {
                method,
                headers: {},
                body: null,
            };

            const correctUrlRegExp = /^(http|https):\/\//i;
            if (!this._isMethodExist(method)) {
                throw [`This is not correct method ${method}`];
            }

            if (!fetchUrl || !correctUrlRegExp.test(fetchUrl)) {
                throw [`Provide correct url`];
            }

            if (needAuth) {
                const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '');
                const { token} = authStorage.state;

                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            if (bodyParams && (method === this._methods.POST || method === this._methods.PUT)) {
                if (isFormData) {
                    config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
                    const data = new FormData;
                    for (let fieldName in bodyParams) {
                        data.append(fieldName, bodyParams[fieldName]);
                    }
                    config.body = data;
                } else {
                    config.headers = { ...config.headers, 'Content-Type': 'application/json' };
                    config.body = JSON.stringify(bodyParams);
                }
            }

            config.headers = { ...config.headers, ...headers };

            const response = await fetch(fetchUrl, config);

            if (!response.ok) {
                return this._requestErrorHandler({ response, config, route, fetchUrl})
            }

            return await response.json();
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    async _get({ route, needAuth, headers }: MethodArguments) {
        return await this._getRequest({
            method: this._methods.GET,
            route,
            needAuth,
            headers,
        }).then(result => result);
    }

    async _post({ route, bodyParams, needAuth, headers, isFormData = false }: MethodArguments) {
        return await this._getRequest({
            method: this._methods.POST,
            route,
            bodyParams,
            needAuth,
            headers,
            isFormData,
        }).then(result => result);
    }

    async _update({ route, bodyParams, needAuth, headers, isFormData = false }: MethodArguments) {
        return await this._getRequest({
            method: this._methods.PUT,
            route,
            bodyParams,
            needAuth,
            headers,
            isFormData,
        }).then(result => result);
    }

    async _delete({ route, needAuth, headers }: MethodArguments) {
        return await this._getRequest({
            method: this._methods.DELETE,
            route,
            needAuth,
            headers,
        }).then(result => result);
    }
}