"use client";

import { useEffect, useState } from "react";

export default function ClientBodyWrapper({ children }) {

  useEffect(() => {
    // This only runs on the client side
    setIsClient(true);
    
    // Only handle VS Code extension classes in development
    if (process.env.NODE_ENV === 'development') {
      const body = document.body;
      
      // Clean up VS Code specific classes that cause hydration issues
      const cleanVSCodeClasses = () => {
        const classList = Array.from(body.classList);
        const vsCodeClasses = classList.filter(cls => 
          cls.includes('vsc-') || 
          cls.includes('vscode-') ||
          cls === 'vsc-initialized'
        );
        
        vsCodeClasses.forEach(cls => body.classList.remove(cls));
      };

      // Clean immediately and on any changes
      cleanVSCodeClasses();
      
      const observer = new MutationObserver(cleanVSCodeClasses);
      observer.observe(body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });

      return () => observer.disconnect();
    }
  }, []);

  // Render children immediately - no conditional rendering needed
  return <>{children}</>;
}
