// Runs in <head> before first paint: puts `dark` on <html> and sets color-scheme from the stored choice
// (or the system preference), so a dark-mode visitor never sees a light flash. next-themes takes over after hydration.
export const themeScript = `(() => {
  try {
    const storageKey = 'theme';
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const systemDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const wantDark = stored === 'dark' || (!stored || stored === 'system') && systemDark;
    const root = document.documentElement;
    if (wantDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch {}
})();`;
