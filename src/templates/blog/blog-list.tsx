'use client';

import { Post } from 'contentlayer/generated';
import { PostCard } from "@/templates/blog/components/post-card/post-card";
import { PostGridCard } from "@/templates/blog/components/post-grid-card/post-grid-card";
import { Search } from "@/components/search/search";
import { useSearchParams } from 'next/navigation';
import { Inbox } from 'lucide-react';
import { useDebouncedValue } from '@/hooks';
import Loading from '@/app/loading';


export type BlogListProps = {
  posts: Post[];
};

export function BlogList({ posts }: BlogListProps) {

  const searchParams = useSearchParams();
  const query = searchParams?.get('q') ?? '';
  const [isSearching] = useDebouncedValue(query, 400);
  const pageTitle = query
    ? `Resultados de busca para "${query}"`
    : 'Dicas e estratégias para impulsionar seu negócio';
  const postList = query
    ? posts.filter(
      (post) => post.title.toLocaleLowerCase()?.includes(query.toLocaleLowerCase())
    )
    : posts;

  const hasPosts = postList.length > 0;

  return (
    <div className="flex flex-col py-24 flex-grow h-full">
      <header className="pb-14">
        <div className="container space-y-6 flex flex-col items-start justify-between md:flex-row md:items-end lg:items-end">
          <div className="flex flex-col gap-4 md:px-0">
            <span className="text-body-tag text-cyan-100 w-fit rounded-md text-center md:text-left py-2 px-4 bg-cyan-300">
              BLOG
            </span>

            <h1 className="text-balance text-start md:text-left text-heading-lg md:text-heading-xl max-w-2xl text-gray-100">
              {pageTitle}
            </h1>
          </div>
          <Search />
        </div>
      </header>

      {isSearching ? (
        <Loading />
      ) : hasPosts ? (
        <PostGridCard>
          {postList.map((post) => (
            <PostCard
              key={post._id}
              title={post.title}
              description={post.description}
              date={new Date(post.date).toLocaleDateString('pt-BR')}
              slug={post.slug}
              image={post.image}
              author={{
                avatar: post.author.avatar,
                name: post.author.name,
              }}
            />
          ))}
        </PostGridCard>
      ) : (
        <div className="container px-8">
          <div className="flex flex-col items-center justify-center gap-8 border-dashed border-2 border-gray-300 p-8 md:p-12 rounded-lg">
            <Inbox className="h-12 w-12 text-cyan-100" />
            <p className="text-gray-100 text-center">Nenhum post encontrado.</p>
          </div>
        </div>
      )}
    </div>
  );

}