'use client';

import Image, { type ImageProps } from 'next/image';
import { useThemedSrc } from '@/lib/use-themed-src';

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  lightSrc?: string;
  darkSrc?: string;
}

export function ThemedImage({ src, lightSrc, darkSrc, alt, ...props }: ThemedImageProps) {
  return <Image src={useThemedSrc(src, lightSrc, darkSrc)} alt={alt} {...props} />;
}
