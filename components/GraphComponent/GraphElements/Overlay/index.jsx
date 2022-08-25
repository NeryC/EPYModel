/** Overlay.js */
import React, { forwardRef } from 'react';

/**
 * Use Overlay as a wrapper for components that need mouse events to be handled.
 * For example: Tooltip, AxisX.
 */
const Overlay = forwardRef(({ width, height, children }, ref) => (
  <g id="Overlay">
    {children}
    <rect ref={ref} width={width} height={height} opacity={0} />
  </g>
));
Overlay.displayName = 'Overlay';
export default Overlay;
