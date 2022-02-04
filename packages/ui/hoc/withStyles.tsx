import React, { ComponentType } from "react";

function withStyles<P>(WrappedComponent: ComponentType<P>, styles: string) {
  return (props: P) => {
    console.log(props);
    return <WrappedComponent {...props} className={styles} />;
  };
}

export default withStyles;
