import 'reflect-metadata';
import {Router} from "express";

export enum EHttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

export function Controller({path = '/'}: {path?: string}) {
    return function(constructor: Function) {
        Reflect.defineMetadata('controller', true, constructor);
        Reflect.defineMetadata('controller.path', path, constructor);
    }
}

export function Request(path: string, method: EHttpMethod) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('request', true, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('request.path', path, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('request.method', method, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('request.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

function Get(path: string) {
    return Request(path, EHttpMethod.GET);
}

function Post(path: string) {
    return Request(path, EHttpMethod.POST);
}

function Put(path: string) {
    return Request(path, EHttpMethod.PUT);
}

function Delete(path: string) {
    return Request(path, EHttpMethod.DELETE);
}

function Patch(path: string) {
    return Request(path, EHttpMethod.PATCH);
}

function Head(path: string) {
    return Request(path, EHttpMethod.HEAD);
}

function Options(path: string) {
    return Request(path, EHttpMethod.OPTIONS);
}

export function ControllerToRouter(controller: Function) {
    const router = Router();

    let controllerPath = Reflect.getMetadata('controller.path', controller);
    let controllerRoutes = Object.getOwnPropertyNames(controller.prototype).filter(key => key !== 'constructor').map(i => controller.prototype[i]);
    let controllerRoutesMetadata = controllerRoutes
                                        .map(i => Reflect.getMetadataKeys(i).map(key => Reflect.getMetadata(key, i)))
                                        .map(i => {return {path: i[1], method: i[2], handler: i[3]}});

    console.log(`Controller path: ${controllerPath}`);
    console.log(`Controller routes: ${controllerRoutesMetadata.map(i => i.path).join(",")}`);

    controllerRoutesMetadata.forEach(route => {
        router.use((req, res, next) => {
            console.log(`Request: ${req.method} ${req.url}`);
            if (req.method === route.method && req.url === route.path) {
                route.handler(req, res);
            }
            next();
        })
    });

    return router;
}

export {
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Head,
    Options
}