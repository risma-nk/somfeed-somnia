'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { contractConfig } from '@/lib/constants';
import toast from 'react-hot-toast';
import { Icons } from './Icons';

type CommentFormProps = {
  postId: bigint;
  onCommentAdded: () => void;
};

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !imageFile) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (!isConnected) {
      toast.error('Please connect wallet.');
      return;
    }
    
    let imageCID = '';
    if (imageFile) {
      setIsUploading(true);
      const uploadToast = toast.loading('Uploading image...');
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        imageCID = data.cid;
        toast.success('Image uploaded!', { id: uploadToast });
      } catch (error) {
        toast.error(`IPFS Upload Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: uploadToast });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      await toast.promise(
        writeContractAsync({
          ...contractConfig,
          functionName: 'commentOnPost',
          args: [postId, content, imageCID],
        }),
        {
          loading: 'Posting comment...',
          success: 'Comment posted!',
          error: 'Failed to post comment.',
        }
      );
      setContent('');
      setImageFile(null);
      onCommentAdded();
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="flex-grow p-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
        disabled={isPending || isUploading}
      />
      <label htmlFor={`comment-img-${postId}`} className="cursor-pointer text-secondary hover:text-primary transition-colors p-2">
        <Icons.image className="w-5 h-5" />
        <input id={`comment-img-${postId}`} type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isPending || isUploading} />
      </label>
      <button
        type="submit"
        disabled={(!content && !imageFile) || isPending || isUploading}
        className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
      >
        <Icons.send className="w-5 h-5" />
      </button>
    </form>
  );
}