"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [isLiked, setIsLiked] = useState(post.likes.includes(session?.user?.id)|| false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleLike = async () => {
    if (!session?.user) {
      alert("Please login to like this prompt");
      return;
    }

    try {
      const response = await fetch('/api/prompt/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: post._id,
          userId: session.user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.hasLiked);
        setLikeCount(data.likes.length);
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <div className={`prompt_card ${post.image ? 'h-auto' : ''}`}>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='font-sans text-sm text-gray-500'>
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'>{post.prompt}</p>
      <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      <div className='mt-3 flex items-center gap-2'>
        <div 
          className='cursor-pointer flex items-center gap-1'
          onClick={handleLike}
        >
          <Image
            src={
              isLiked
                ? "/assets/icons/save.png"
                : "/assets/icons/heart.png"
            }
            alt={isLiked ? "unlike" : "like"}
            width={24}
            height={24}
          />

          <span className='font-inter text-sm text-gray-500'>
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
      </div>

      {post.image && (
        <div className='relative w-full mt-3'>
          <img 
            src={post.image} 
            alt='prompt_image' 
            className='object-cover rounded-lg w-full h-auto' 
          />
        </div>
      )}
      
      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm text-red-700  cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
