// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'

import { createRouter } from './router'
// import {dbConnect} from "./lib/db";

// dbConnect()

export default createStartHandler({
    createRouter,
    getRouterManifest,
})(defaultStreamHandler)