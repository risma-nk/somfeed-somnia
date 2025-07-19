import { AvatarComponent } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { ReactNode } from 'react';

export const CustomAvatar: AvatarComponent = ({ address, size }): ReactNode => {
  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${address}`;

  return (
    <Image
      src={avatarUrl}
      alt="DiceBear Avatar"
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  );
};