export type Breakpoint = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS]; 

export const BREAKPOINTS = {
  0: 'xs',
  600: 'sm',
  960: 'md',
  1280: 'lg',
  1920: 'xl',
} as const;