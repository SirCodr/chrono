import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/lib/breakpoints";

type Breakpoint = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS];
type BreakpointState = Record<Breakpoint, boolean>;

export default function useBreakpoint() {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [breakpoints, setBreakpoints] = useState<BreakpointState>(
    Object.values(BREAKPOINTS).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as BreakpointState
    )
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth === undefined) return;

    const entries = Object.entries(BREAKPOINTS).map(([minWidth, key], i, arr) => {
      const nextMin = Number(arr[i + 1]?.[0]) || Infinity;
      return [key, windowWidth >= Number(minWidth) && windowWidth < nextMin];
    });

    setBreakpoints(Object.fromEntries(entries) as BreakpointState);
  }, [windowWidth]);

  return breakpoints;
}
