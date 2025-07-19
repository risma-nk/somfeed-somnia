"use client";

import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import { useReadContract } from "wagmi";
import { contractConfig } from "@/lib/constants";
import { useEffect, useState } from "react";
import Image from "next/image";
import somfeedLogo from "../public/somfeed.svg";
type Post = {
  id: bigint;
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
  likes: bigint;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const {
    data: fetchedPosts,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    ...contractConfig,
    functionName: "getAllPosts",
  });

  useEffect(() => {
    if (fetchedPosts) {
      setPosts([...(fetchedPosts as Post[])].reverse());
    }
  }, [fetchedPosts]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mb-2">
        <Image
          src={somfeedLogo}
          alt="SomFeed Logo"
          width={512}
          height={512}
          priority
        />
      </div>

      {/* Form post */}
      <CreatePost onPostCreated={refetch} />

      {/* Feed */}
      <div className="mt-8 space-y-6">
        {isLoading && (
          <p className="text-center text-secondary">Loading feed...</p>
        )}
        {error && (
          <p className="text-center text-red-500">
            Error loading feed: {error.message}
          </p>
        )}
        {posts.length > 0
          ? posts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))
          : !isLoading && (
              <p className="text-center text-secondary">
                No posts yet. Be the first to post!
              </p>
            )}
      </div>
    </div>
  );
}
