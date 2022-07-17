import { css } from '@emotion/react';
import Link from 'next/link';

const headerStyles = css`
  z-index: 10000000;
  position: absolute;
  top: 50%;
  left: 50%;
  background: #e1e1e1;
  border-radius: 4px;
  justify-content: space-between;
  display: flex;
  max-width: 640px;
  transform: translate(-50%, -50%);

  > a {
    text-decoration: none;
    text-decoration-color: none;
  }
`;

export default function Header(props) {
  return (
    <header css={headerStyles}>
      {props.user && <span>{props.user.username}</span>}
      {'   '}
      {props.user ? (
        <Link href="/logout">logout</Link>
      ) : (
        <div>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </div>
      )}
    </header>
  );
}
