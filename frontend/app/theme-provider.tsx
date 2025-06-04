// app/my-theme-provider.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// We will let TypeScript infer the props type or use React.ComponentProps for now

type NextThemesProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
  children: React.ReactNode;
};

export function MyThemeProvider(props: NextThemesProviderProps) {
  const { children, ...rest } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return null or a basic version of children to prevent hydration mismatch
    // For simplicity, and because ThemeProvider often handles this well,
    // you can also try returning children directly inside a fragment
    // if null causes issues with your layout.
    return null; // Or <>{children}</>
  }

  return <NextThemesProvider {...rest}>{children}</NextThemesProvider>;
}