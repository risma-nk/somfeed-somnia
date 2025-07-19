"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { contractConfig, POST_FEE_ETH } from "../../lib/constants";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import { Icons } from "./Icons";

type CreatePostProps = {
  onPostCreated: () => void;
};

const MAX_CHAR_LIMIT = 230;

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value.slice(0, MAX_CHAR_LIMIT));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !imageFile) {
      toast.error("Post cannot be empty.");
      return;
    }
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }

    let imageCID = "";
    if (imageFile) {
      setIsUploading(true);
      toast.loading("Hold up... don’t close this tab 😅");
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        imageCID = data.cid;
        toast.dismiss();
        toast.success(`Success! Now it's part of the story.`);
      } catch (error) {
        console.error("IPFS Upload Error:", error);
        toast.dismiss();
        toast.error(`Something went off the rails 😵 check again?`);
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
          functionName: "createPost",
          args: [content, imageCID],
          value: parseEther(POST_FEE_ETH),
        }),
        {
          loading: "Waiting for your signature...",
          success: "Boom! Your post is now live 🔥",
          error: "Uh-oh. Couldn’t publish your post 😓",
        }
      );
      setContent("");
      setImageFile(null);
      onPostCreated();
    } catch (error) {
      console.error("Contract Write Error:", error);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What's happening on Somnia?"
            className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none resize-none"
            rows={4}
            disabled={isPending || isUploading}
          />
          <div className="text-right text-sm pr-1">
            <span
              className={
                content.length >= MAX_CHAR_LIMIT
                  ? "text-red-500 font-bold"
                  : "text-secondary"
              }
            >
              {content.length}/{MAX_CHAR_LIMIT}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-secondary hover:text-primary transition-colors"
          >
            <Icons.image className="w-6 h-6 inline-block mr-2" />
            <span>{imageFile ? imageFile.name : "Add Image"}</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isPending || isUploading}
            />
          </label>
          <button
            type="submit"
            disabled={(!content && !imageFile) || isPending || isUploading}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            {isPending
              ? "Letting the chain know..."
              : isUploading
              ? "Preparing your drop..."
              : `Yap it!`}
          </button>
        </div>
      </form>
    </div>
  );
}
