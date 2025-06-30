/**
 * Lazy Loading Utilities
 */
export class LazyLoader {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }

  async loadModule(modulePath) {
    // Return cached module if already loaded
    if (this.loadedModules.has(modulePath)) {
      return this.loadedModules.get(modulePath);
    }

    // Return existing loading promise if currently loading
    if (this.loadingPromises.has(modulePath)) {
      return this.loadingPromises.get(modulePath);
    }

    // Start loading the module
    const loadingPromise = this.loadModuleInternal(modulePath);
    this.loadingPromises.set(modulePath, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.set(modulePath, module);
      this.loadingPromises.delete(modulePath);
      return module;
    } catch (error) {
      this.loadingPromises.delete(modulePath);
      throw error;
    }
  }

  async loadModuleInternal(modulePath) {
    window.performanceMonitor.startTiming(`load-${modulePath}`);
    try {
      const module = await import(modulePath);
      window.performanceMonitor.endTiming(`load-${modulePath}`);
      console.log(`📦 Lazy loaded: ${modulePath}`);
      return module;
    } catch (error) {
      console.error(`❌ Failed to lazy load: ${modulePath}`, error);
      throw error;
    }
  }

  async preloadModules(modulePaths) {
    const preloadPromises = modulePaths.map(path => 
      this.loadModule(path).catch(error => {
        console.warn(`Preload failed for ${path}:`, error);
      })
    );
    await Promise.allSettled(preloadPromises);
  }

  clearCache() {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// Global lazy loader instance
window.lazyLoader = new LazyLoader(); 