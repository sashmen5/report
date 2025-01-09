import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sashmen5/components';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { ModeToggle } from '../features';
import { dbConnectMiddleware } from '../lib/db';
import { generateBlogTitle } from '../lib/generate';
import { Post } from '../models/post';

let counter: number = 10;

async function readCount(): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(counter);
    }, 20);
  });
}

async function writeCount(number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      counter = number;
      resolve();
    }, 20);
  });
}

function getPosts(): Promise<{ title: string; description: string }[]> {
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
    };
  });

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    const count = await readCount();
    console.log({ count, data });
    await writeCount(count + data);
    console.log('[AFTER]');
  });

function readPosts() {
  return Post.find().exec();
}

const addPost = createServerFn({ method: 'POST' })
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    const newPost = new Post({ title: generateBlogTitle(), description: generateBlogTitle() });
    return newPost.save();
  });

export const Route = createFileRoute('/')({
  component: () => {
    return (
      <>
        <Home />
      </>
    );
  },
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();
  // return <div>{'Empty'}</div>

  return (
    <div>
      <div className={'mx-auto flex max-w-[400px] flex-col gap-4 pt-4'}>
        <div className={'ml-auto'}>
          <ModeToggle />
        </div>
        <Button
          type="button"
          variant={'secondary'}
          onClick={() => {
            updateCount({ data: 1 }).then(() => {
              router.invalidate();
            });
          }}
        >
          Add 1 to {state.count}?
        </Button>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          onClick={() => {
            addPost({ data: undefined }).then(() => {
              router.invalidate();
            });
          }}
        >
          There are {state.posts.length} posts. Add a new one?
        </Button>
        <div className={'rounded-2xl border-2 border-dashed border-purple-500 p-4'}>
          <pre>
            <code
              style={{
                whiteSpace: 'break-spaces',
              }}
            >
              {JSON.stringify(state.posts, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
