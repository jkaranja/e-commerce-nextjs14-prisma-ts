// app/ThemeRegistry.tsx
"use client";
import createCache from "@emotion/cache";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMediaQuery } from "@mui/material";
import { themeSettings } from "./theme";
import { EmotionCache, Options as OptionsOfCreateCache } from "@emotion/cache";

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry(props: {
  children: React.ReactNode;
  options: OptionsOfCreateCache;
}) {
  const { options, children } = props;

  //you can allow users to switch between dark and light manually or apply mode set in users os using
  // @media('prefers-color-scheme: dark') query(in css). With Mui you can use useMediaQuery hook instead
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = themeSettings(prefersDarkMode);

  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

// app/layout.js
// export default function RootLayout(props) {
//   const { children } = props;
//   return (
//     <html lang="en">
//       <body>
//         <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
//       </body>
//     </html>
//   );
// }
