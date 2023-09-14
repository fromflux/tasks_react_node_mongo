/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import styles from './button.module.css';

export default function AppButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // eslint-disable-next-line react/prop-types
  const { type = 'button', className, children } = props;
  return (
    <button
      className={`${styles.Button} ${className || ''}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
