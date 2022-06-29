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

// CANVAS CODE THAT IM SCARED TO DELETE
// const canvasRef = useRef(null);
// const [movement, setMovement] = useState(false);
// useEffect(() => {
//   const canvas = canvasRef.current;
//   canvas.width = 640;
//   canvas.height = 380;
//   const context = canvas.getContext('2d');
//   context.fillStyle = 'blue';
//   context.fillRect(0, 0, window.innerWidth, window.innerHeight);

//   let timeToNextDragQueen = 0;
//   let dragQueenInterval = 7000;
//   let lastTime = 0;

//   let dragQueens = [];
//   class DragQueen {
//     constructor() {
//       this.width = 50;
//       this.height = 100;
//       this.x = canvas.width;
//       this.y = canvas.height - 300;
//       this.directionX = 2;
//     }
//     update() {
//       this.x -= this.directionX;
//     }

//     draw() {
//       context.fillRect(this.x, this.y, this.width, this.height);
//     }
//   }
//   function animate(timestamp) {
//     // if (timestamp < Math.random() * 5000 + 5000) {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     let deltaTime = timestamp - lastTime;
//     lastTime = timestamp;
//     timeToNextDragQueen += deltaTime;
//     if (timeToNextDragQueen > dragQueenInterval) {
//       dragQueens.push(new DragQueen());
//       timeToNextDragQueen = 0;
//     }
//     // }
//     [...dragQueens].forEach((object) => object.update());
//     [...dragQueens].forEach((object) => object.draw());
// }
// console.log(timestamp);
// requestAnimationFrame(animate);
// }
// animate(0);
// console.log(typeof Math.floor(Math.random() * (4 - 1 + 1) + 1));
// }, []);
// this code was working yesterday
// useEffect(() => {
//   const canvas = canvasRef.current;
//   canvas.width = 640;
//   canvas.height = 380;
//   const context = canvas.getContext('2d');
//   context.fillStyle = 'blue';
//   context.fillRect(0, 0, window.innerWidth, window.innerHeight);
//   let dragQueens = [];
//   function dragQueen() {
//     let width = 50;
//     let height = 100;
//     let x = canvas.width;
//     let y = canvas.height - 200;
//     let directionX = 2;

//     function update() {
//       x -= directionX;
//     }

//     function draw() {
//       context.fillRect(x, y, width, height);
//     }

//     function animate(timestamp) {
//       if (timestamp <= 4000) {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         update();
//         draw();
//       }

//       if (movement === true) {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//       }
//       requestAnimationFrame(animate);
//     }
//     animate();
//   }
//   dragQueen();

//   // const dragQueen = new DragQueen();
// }, []);
