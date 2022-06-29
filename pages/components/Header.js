import { css } from '@emotion/react';
import Link from 'next/link';

const headerStyles = css`
  background: #e1e1e1;
  border-radius: 4px;
  justify-content: space-between;
  display: flex;
  max-width: 640px;

  > a {
    text-decoration: none;
    text-decoration-color: none;
  }
`;

export default function Header(props) {
  return (
    <header css={headerStyles}>
      {props.user && <Link href="/users/1">{props.user.username}</Link>}
      {props.user ? (
        <a href="/logout">Logout</a>
      ) : (
        <>
          {/* <Link href="/register">Register</Link>
          <Link href="/login">Login</Link> */}
        </>
      )}
    </header>
  );
}
