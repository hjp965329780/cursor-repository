export function generateSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }
  
  let path: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    
    if (current.className && typeof current.className === 'string') {
       // Filter out common utility classes or dynamic classes if needed
       // Also filter out our own classes (ps- prefix)
       const classes = current.className.split(/\s+/).filter(c => c && !c.startsWith('ps-'));
       if (classes.length > 0) {
         selector += `.${classes.join('.')}`;
       }
    }
    
    // Add nth-child if needed
    let parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(e => e.tagName === current!.tagName);
      if (siblings.length > 1) {
        const index = Array.from(parent.children).indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}
