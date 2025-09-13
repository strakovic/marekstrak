"use client";

import { useEffect, useState, useRef } from 'react';

interface DarkReaderSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * DarkReaderSafe component that prevents hydration mismatches caused by DarkReader browser extension
 * This component waits for client-side mounting before rendering children to avoid SSR/client differences
 */
export default function DarkReaderSafe({ children, fallback }: DarkReaderSafeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set mounted after a brief delay to ensure DarkReader has initialized
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    // Create a mutation observer to handle DarkReader changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          const attributeName = mutation.attributeName;
          // If DarkReader adds problematic attributes, we can handle them here
          if (attributeName?.startsWith('data-darkreader-inline-')) {
            // For hydration safety, we don't modify the attributes
            // Instead, we rely on CSS to override the styling
          }
        }
      });
    });

    // Observe the container for DarkReader changes
    observer.observe(containerRef.current, {
      attributes: true,
      subtree: true,
      attributeFilter: [
        'data-darkreader-inline-color',
        'data-darkreader-inline-bgcolor',
        'data-darkreader-inline-bgimage',
        'data-darkreader-inline-stroke',
        'data-darkreader-inline-fill',
        'data-darkreader-inline-boxshadow',
        'data-darkreader-inline-stopcolor'
      ]
    });

    return () => observer.disconnect();
  }, [isMounted]);

  if (!isMounted) {
    return <div ref={containerRef}>{fallback}</div>;
  }

  return <div ref={containerRef}>{children}</div>;
}