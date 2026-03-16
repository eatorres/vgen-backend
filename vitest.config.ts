import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
    test: {
        // Don't emit console logs for passing tests to reduce noise
        silent: 'passed-only',
    },
});
