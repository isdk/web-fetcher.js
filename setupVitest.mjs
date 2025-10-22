// 这个 fetchMock 没有传递abort 中的 reason!

/*
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
// import './fetch-polyfill.mjs';

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();

// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
fetchMocker.dontMock();
*/