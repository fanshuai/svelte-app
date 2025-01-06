// place files you want to import through the `$lib` alias in this folder.

import { Code, ConnectError, createClient, type Interceptor, type Transport } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
// import { toastService } from '$lib/services/toast.service';
// import { reloadLater } from '$lib/apis/http';
import { dev } from '$app/environment';

const useToken: Interceptor = (next) => async (req) => {
	let token: string = getToken();
	if (token) req.header.set('Authorization', `Bearer ${token}`);
	req.header.set('X-C-Version', 'feVersion');
	const resp = await next(req);
	token = resp.header.get('x-token') || '';
	if (token) setToken(token);
	return resp;
};


const useCatch: Interceptor = (next) => async (req) => {
	try {
		return await next(req);
	} catch (err) {
		const connectErr = ConnectError.from(err);
		if (connectErr.code == Code.Aborted) {
			// reloadLater(5);
			console.warn('Aborted:', connectErr);
		} else if (connectErr.code == Code.Unauthenticated) {
			// reloadLater(3);
			console.warn('Unauthenticated:', connectErr);
		} else if (connectErr.code == Code.InvalidArgument) {
			// toastService.setAlertWarning(connectErr.message);
			console.warn('InvalidArgument:', connectErr);
		} else {
			console.error('connectErr:', connectErr);
		}
		return Promise.reject(connectErr);
	}
};


export const transport: Transport = createConnectTransport({
	baseUrl: 'PUBLIC_API_HOST',
	interceptors: [useToken, useCatch],
	defaultTimeoutMs: 5000,
	useBinaryFormat: !dev
});



export const storageTokenKey: string = 'token';

export const getToken = (): string => {
	return localStorage.getItem(storageTokenKey) || '';
};

export const setToken = (token: string): void => {
	localStorage.setItem(storageTokenKey, token);
};
