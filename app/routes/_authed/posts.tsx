import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import axios from 'redaxios';

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async () => {
  console.info('Fetching posts...');
  await new Promise(r => setTimeout(r, 1000));
  return axios
    .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
    .then(r => r.data.slice(0, 10));
});

export const Route = createFileRoute('/_authed/posts')({
  loader: ctx => {
    return fetchPosts();
  },
  component: () => {
    return <PostsComponent />;
  },
});

function PostsComponent() {
  const posts = Route.useLoaderData();
  const context = Route.useRouteContext();

  return (
    <div className="flex gap-2 p-2">
      <ul className="list-disc pl-4">
        {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(post => {
          return (
            <li key={post.id} className="whitespace-nowrap">
              <Link
                to="/posts/$postId"
                params={{
                  postId: post.id,
                }}
                className="block py-1 text-blue-800 hover:text-blue-600"
                activeProps={{ className: 'text-black font-bold' }}
              >
                <div>{post.title.substring(0, 20)}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
