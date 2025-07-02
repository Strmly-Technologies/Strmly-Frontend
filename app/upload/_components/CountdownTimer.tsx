"use client"

import { useEffect, useState } from "react"

type Props = {
  seconds: number
  onComplete: () => void
}

const CountdownTimer = ({ seconds, onComplete }: Props) => {
  const [time, setTime] = useState(seconds)

  useEffect(() => {
    if (time <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setTime((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [time])

  return <div>{time}</div>
}

export default CountdownTimer