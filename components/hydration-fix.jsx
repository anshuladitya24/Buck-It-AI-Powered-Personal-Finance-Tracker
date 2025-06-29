"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Only run in development to prevent VS Code extension hydration issues
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Remove VS Code classes that cause hydration mismatches
      const removeVSCodeClasses = () => {
        const body = document.body;
        const classesToRemove = ['vsc-initialized', 'vscode-dark', 'vscode-light'];
        classesToRemove.forEach(className => {
          if (body.classList.contains(className)) {
            body.classList.remove(className);
          }
        });
      };

      // Remove immediately and set up observer
      removeVSCodeClasses();
      
      const observer = new MutationObserver(() => {
        removeVSCodeClasses();
      });
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
}
