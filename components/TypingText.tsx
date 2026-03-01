"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string;
  speed?: number;
};

export default function TypingText({ text, speed =  90 }: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}
