import React, { ComponentType } from "react";

function withStyles<P>(WrappedComponent: ComponentType<P>, styles: string) {
  return (props: P) => <WrappedComponent {...props} className={styles} />;
}

export default withStyles;
