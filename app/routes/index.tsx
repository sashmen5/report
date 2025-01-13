import React, { useEffect, useRef } from 'react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@sashmen5/components';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { ModeToggle } from '../features';
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
  component: Home,
  // loader: async () => await getCount(),
});

function Home() {
  // const router = useRouter();
  // const state = Route.useLoaderData();
  // return <div>{'Empty'}</div>
  return (
    <div className={'flex flex-col justify-center gap-1 overflow-hidden'}>
      <ReportYear />
    </div>
  );
}
