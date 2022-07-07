import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const gameBackgroundStyles = css`
  margin: 0 auto;
`;

export default function Game() {
  return (
    <div css={gameBackgroundStyles}>
      <Image src="/../public/background.png" width="640" height="380" />
    </div>
  );
}

function doSomethingEveryTwoSeconds() {
  console.log('HIIIII');
}

setTimeout(doSomethingEveryTwoSeconds, 2000);
