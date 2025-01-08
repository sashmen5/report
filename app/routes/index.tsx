import {createFileRoute, useRouter} from '@tanstack/react-router'
import {createServerFn} from '@tanstack/start'
import {generateBlogTitle} from "../lib/generate";
import {Post} from "../models/post";
import {dbConnectMiddleware} from "../lib/db";


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

function getPosts(): Promise<{ title: string, description: string }[]> {
    return Post.find().exec();
}

const getCount = createServerFn({
    method: 'GET',
})
    .middleware([dbConnectMiddleware])
    .handler(async () => {
        return {
            count: await readCount(),
            posts: await getPosts(),
        }
    })


const updateCount = createServerFn({method: 'POST'})
    .validator((d: number) => d)
    .middleware([dbConnectMiddleware])
    .handler(async ({data}) => {
        const count = await readCount();
        console.log({count, data})
        await writeCount(count + data);
        console.log('[AFTER]')
    })

function readPosts() {
    return Post.find().exec();
}

const addPost = createServerFn({method: 'POST'})
    .middleware([dbConnectMiddleware])
    .handler(async ({data}) => {
        const newPost = new Post({title: generateBlogTitle(), description: generateBlogTitle()})
        return newPost.save()
    })

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => await getCount(),
})

function Home() {
    const router = useRouter()
    const state = Route.useLoaderData()
    // return <div>{'Empty'}</div>

    return (
        <div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>
                <button
                    type="button"
                    onClick={() => {
                        updateCount({data: 1}).then(() => {
                            router.invalidate()
                        })
                    }}
                >
                    Add 1 to {state.count}?
                </button>

                <button
                    type="button"
                    onClick={() => {
                        addPost({data: undefined}).then(() => {
                            router.invalidate()
                        })
                    }}
                >
                    There are {state.posts.length} posts. Add a new one?
                </button>
                <div style={{
                    border: "2px dashed purple",
                    borderRadius: "15px",
                    padding: "10px",
                }}>
                <pre>
                    <code>

                {JSON.stringify(state.posts, null, 2)}
                    </code>
                </pre>
                </div>
            </div>
        </div>
    )
}
