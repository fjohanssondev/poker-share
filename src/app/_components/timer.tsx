"use client"

import { useLayoutEffect, useState } from "react";
import { api } from "~/trpc/react"

export default function Timer({ gameId }: { gameId: string }) {

  const [time, setTime] = useState("")
  const [milliseconds, setMilliseconds] = useState(0)

  const { data } = api.game.getGameInfo.useQuery(gameId);

  const gameStartedAt = data?.startTime?.getTime()
  const fiveHours = 18000000
  const initialProgress = (milliseconds / fiveHours) * 100; // This is the initial progress in milliseconds
  const [progress, setProgress] = useState(initialProgress)

  const convertTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  useLayoutEffect(() => {

    const interval = setInterval(() => {

      if (!gameStartedAt) {
        return;
      }

      const currentTimeInMilliseconds = new Date().getTime() - gameStartedAt
      setMilliseconds(new Date().getTime() - gameStartedAt)
      setTime(convertTime(currentTimeInMilliseconds))
    }, 1000)

    return () => clearInterval(interval)

  }, [gameStartedAt])

  useLayoutEffect(() => {
    setProgress((milliseconds / fiveHours) * 100);
  }, [milliseconds])

  return (
    <div className="flex justify-center lg:justify-start">
      <CircularTimer timer={time} progress={progress} />
    </div>
  )
}

export function CircularTimer({ progress, timer }: { progress: number, timer: string }) {

  const strokeWidth = 15;
  const radius = 90; // Updated radius to 90
  const circumference = 2 * Math.PI * radius; // Recalculated circumference
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // The SVG size should be large enough to include the entire circle and its stroke
  const svgSize = radius * 2 + strokeWidth * 2;
  const center = radius + strokeWidth; // The center coordinate for the circle

  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full relative">
      <svg width={svgSize} height={svgSize} className="w-full h-full">
        {/* Background Circle (Gray) */}
        <circle
          className="text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset="0"
        />
        {/* Progress Circle (Blue) */}
        <circle
          className="text-secondary"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <span className="absolute text-4xl text-secondary" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {timer}
      </span>
    </div>
  );
}