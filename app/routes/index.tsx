// app/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const filePath = 'count.txt'

let counter: number = 10;

async function readCount(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(counter)
        }, 20)
    })
}

async function writeCount(number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            counter = number;
            resolve();
        }, 20)
    })
}

const getCount = createServerFn({
    method: 'GET',
}).handler(async () => {
    return await readCount()
})

const updateCount = createServerFn({ method: 'POST' })
    .validator((d: number) => d)
    .handler(async ({ data }) => {
        const count = await readCount();
        console.log({ count, data })
        await writeCount(count + data);
        console.log('[AFTER]')
    })

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => await getCount(),
})

function Home() {
    const router = useRouter()
    const state = Route.useLoaderData()

    return (
        <button
            type="button"
            onClick={() => {
                updateCount({ data: 1 }).then(() => {
                    router.invalidate()
                })
            }}
        >
            Add 1 to {state}?
        </button>
    )
}