export interface PromiseLock extends Promise<void> {
  release: () => void;
}

export function createPromiseLock(): PromiseLock {
  let release: () => void = () => {};
  const promise = new Promise<void>(resolve => {
    release = resolve;
  });
  const releasablePromise = promise as PromiseLock;
  releasablePromise.release = release;
  return releasablePromise;
}

export function createResolvedPromiseLock(): PromiseLock {
  const lock = createPromiseLock();
  lock.release();
  return lock;
}
