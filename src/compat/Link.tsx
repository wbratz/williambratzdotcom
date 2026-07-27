import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  legacyBehavior?: boolean;
};

export default function Link({ href, children, legacyBehavior }: Props) {
  if (legacyBehavior && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ href?: string }>, {
      href,
    });
  }
  return <a href={href}>{children}</a>;
}
