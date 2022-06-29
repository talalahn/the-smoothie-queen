import { css } from '@emotion/react';
import Image from 'next/image.js';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { deflateRaw } from 'zlib';
import { Recipes } from './components/Recipes.js';

import('./scripts/setup.js');

const wrapperStyles = css`
  border: 5px solid black;
  top: 50%;
  left: 50%;
  position: absolute;
  width: 640px;
  height: 380px;
  transform: translate(-50%, -50%);
`;

const fakePersonStyles = (personState) => css`
  background-color: pink;
  height: 100px;
  width: 50px;
  position: absolute;
  margin-top: -200px;
  margin-left: 400px;

  height: ${personState ? '500px' : 0};
  /* overflow: hidden; */
`;

export default function GamePage() {
  const [personState, setPersonState] = useState(true);
  console.log(typeof personState);
  console.log(personState);
  return (
    <div>
      <div>
        <Image src="/background.png" width="640" height="380" />
        <div
          css={fakePersonStyles(personState)}
          onClick={() => {
            setPersonState(false);
          }}
        ></div>
      </div>
      <Recipes></Recipes>
    </div>
  );
}
