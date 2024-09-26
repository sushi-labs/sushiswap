import { memo } from "react";

export const DotGridPatternDefs = memo(() => {
  return (
    <defs>
      <pattern
        id='bgDotPattern'
        patternUnits='userSpaceOnUse'
        width='8'
        height='8'
        className='text-secondary'
      >
        <circle
          cx='4'
          cy='4'
          r='1'
          fill='currentColor'
        />
      </pattern>
    </defs>
  );
});
DotGridPatternDefs.displayName = "DotGridPatternDefs";