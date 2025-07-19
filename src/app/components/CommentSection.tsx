'use client';

import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import CommentForm from './CommentForm';
import { CustomAvatar } from '@/lib/avatar';
import DisplayUsername from './DisplayUsername';

type Comment = {
  author: `0x${string}`;
  content: string;
  imageCID: string;
  timestamp: bigint;
};

export default function CommentSection({ postId }: { postId: bigint }) {
  const { data: comments, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'getComments',
    args: [postId],
  });

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <CommentForm postId={postId} onCommentAdded={refetch} />
      <div className="mt-4 space-y-4">
        {isLoading && <p className="text-secondary text-sm">Loading comments...</p>}
        {comments && (comments as Comment[]).length > 0 ? (
          (comments as Comment[]).map((comment, index) => (
            <div key={index} className="flex gap-3 text-sm">
              <div className="mt-1">
                <CustomAvatar address={comment.author} size={32} />
              </div>
              <div className='w-full'>
                <div className='bg-background p-3 rounded-lg border border-border'>
                  <div className="flex justify-between items-center mb-1">
                    <DisplayUsername address={comment.author} />
                    <span className="text-xs text-secondary">
                      {formatDistanceToNow(new Date(Number(comment.timestamp) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                   {comment.imageCID && (
                    <div className="mt-2">
                      <img
                        src={`https://ipfs.io/ipfs/${comment.imageCID}`}
                        alt="Comment image"
                        className="rounded-lg max-h-48 w-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-secondary text-sm text-center">No comments yet.</p>
        )}
      </div>
    </div>
  );
}