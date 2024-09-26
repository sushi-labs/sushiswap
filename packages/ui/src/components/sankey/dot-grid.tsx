import { memo } from "react";

export const DotGridPatternDefs = memo(() => {
  return (
    <defs>
      <pattern
        id='bgDotPattern'
        patternUnits='userSpaceOnUse'
        width='8'
        height='8'
      >
        <circle
          cx='4'
          cy='4'
          r='1'
          fill='rgba(0,0,0,0.08)'
        />
      </pattern>
    </defs>
  );
});
DotGridPatternDefs.displayName = "DotGridPatternDefs";