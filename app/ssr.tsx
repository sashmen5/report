// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'
// import { registerGlobalMiddleware } from '@tanstack/start'

import { createRouter } from './router'
import {dbConnect, dbConnectMiddleware} from "./lib/db";

// dbConnect()


// registerGlobalMiddleware({
//     middleware: [dbConnectMiddleware],
// })

await dbConnect();

export default createStartHandler({
    createRouter,
    getRouterManifest,
})(defaultStreamHandler)