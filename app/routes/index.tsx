// app/routes/index.tsx
// import * as fs from 'node:fs'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
// import {Post} from "../models/post";
// import {generateBlogTitle} from "./generate";

// const filePath = 'count.txt'

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

// function readPosts() {
//     return Post.find().exec();
// }

// const addPost = createServerFn({ method: 'POST' })
//     .handler(async ({ data }) => {
//         const newPost = new Post({ title: generateBlogTitle(), description: generateBlogTitle() })
//         return newPost.save()
//     })

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => await getCount(),
})

function Home() {
    const router = useRouter()
    const state = Route.useLoaderData()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
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

            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => {*/}
            {/*        addPost({ data: undefined  }).then(() => {*/}
            {/*            router.invalidate()*/}
            {/*        })*/}
            {/*    }}*/}
            {/*>*/}
            {/*    There are {state.posts.length} posts. Add a new one?*/}
            {/*</button>*/}
        </div>
    )
}