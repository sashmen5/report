import React from 'react';

import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { getCookie } from 'vinxi/http';

import { dbConnectMiddleware } from '../lib/db';
import { generateBlogTitle } from '../lib/generate';
import { Post } from '../models/post';
import { ReportYear } from '../pages';

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
    await writeCount(count + data);
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

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getCookie('alex-token');

  if (!cookie) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    throw redirect({
      to: '/login',
    });
  }

  return {};
});

export const Route = createFileRoute('/')({
  beforeLoad: async () => await authStateFn(),
  component: Home,
  // loader: async () => await getCount(),
});

function Home() {
  // const router = useRouter();
  // const state = Route.useLoaderData();
  // return <div>{'Empty'}</div>
  return (
    <div className={'flex flex-col justify-center gap-1 overflow-hidden pt-10'}>
      <ReportYear />
    </div>
  );
}
