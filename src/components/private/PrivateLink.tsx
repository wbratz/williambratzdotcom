import React from "react";

export default function PrivateLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  if (
    React.isValidElement<{ href?: string }>(children) &&
    children.type === "a"
  )
    return React.cloneElement(children, { href });
  return <a href={href}>{children}</a>;
}
