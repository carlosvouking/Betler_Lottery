import { ImageProps, StaticImageData } from 'next/image';
import React from 'react'

interface Props {
    src: string;
    alt: string;
    title?: string;
}


function Image( {src, alt} : Props) {
  return (
    <img src={src} alt={alt} />
  )
}

export default Image