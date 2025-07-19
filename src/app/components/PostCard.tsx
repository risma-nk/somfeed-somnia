'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { contractConfig } from '../../lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { Icons } from './Icons';
import CommentSection from './CommentSection';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DisplayUsername from "./DisplayUsername";
import { CustomAvatar } from "../../lib/avatar";

type Post = {
  id: bigint;
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
  likes: bigint;
};

export default function PostCard({ post }: { post: Post }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [showComments, setShowComments] = useState(false);

  const { data: hasLiked } = useReadContract({
    ...contractConfig,
    functionName: 'likes',
    args: [post.id, address!],
    query: {
      enabled: !!address,
    }
  });

  const { data: commentsData } = useReadContract({
    ...contractConfig,
    functionName: 'getComments',
    args: [post.id],
  });

  const commentCount = Array.isArray(commentsData) ? commentsData.length : 0;

  const handleLike = async () => {
    if (hasLiked) {
      toast.error("You've already liked this post.");
      return;
    }
    try {
      await toast.promise(
        writeContractAsync({
          ...contractConfig,
          functionName: 'likePost',
          args: [post.id],
        }),
        {
          loading: 'Liking post...',
          success: 'Post liked!',
          error: 'Failed to like post.',
        }
      );
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(Number(post.timestamp) * 1000), { addSuffix: true });

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-3">
        <CustomAvatar address={post.author} size={40} />
        <div>
          <DisplayUsername address={post.author} />
          <p className="text-xs text-secondary">{timeAgo}</p>
        </div>
      </div>
      
      {post.content && <p className="text-gray-300 mb-3 whitespace-pre-wrap">{post.content}</p>}

      {post.imageCID && (
        <div className="my-4">
          <img
            src={`https://ipfs.io/ipfs/${post.imageCID}`}
            alt="Post image"
            className="rounded-lg max-h-96 w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-6 text-secondary border-t border-border pt-3">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Icons.comment className="h-5 w-5" />
          <span>{commentCount}</span> 
        </button>
        <button
          onClick={handleLike}
          disabled={hasLiked as boolean}
          className="flex items-center gap-2 hover:text-primary disabled:text-primary disabled:cursor-not-allowed transition-colors"
        >
          <Icons.like className={`h-5 w-5 ${hasLiked ? 'text-primary' : ''}`} />
          <span>{post.likes.toString()}</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}