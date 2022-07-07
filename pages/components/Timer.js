import { useEffect, useState } from 'react';

const useFrameTime = () => {
  const [frameTime, setFrameTime] = useState(performance.now());
  useEffect(() => {
    let frameId;
    const frame = (time) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

const Timer = () => {
  const [startTime, setStartTime] = React.useState(0);
  const [pauseTime, setPauseTime] = React.useState(0);
  const paused = pauseTime !== undefined;
  const frameTime = useFrameTime();
  const displayTime = paused ? pauseTime : frameTime - startTime;
  const pause = () => {
    setPauseTime(displayTime);
  };
  const play = () => {
    setStartTime(performance.now() - pauseTime);
    setPauseTime(undefined);
  };
  return (
    <div>
      <button onClick={paused ? play : pause}>
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
};

export default function Timer() {
  return <Timer />;
}
