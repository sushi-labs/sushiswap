import { loadJSON } from '../utils/file.js';
export class ManifestParser {
    async loadManifest(runtimePaths) {
        // Load build manifest
        const buildManifest = await loadJSON(runtimePaths.BUILD_MANIFEST);
        // Throw error if no build manifest exist
        if (!buildManifest) {
            throw new Error('Unable to find build manifest, make sure to build your next project before running next-sitemap command');
        }
        // Load pre-render manifest
        const preRenderManifest = await loadJSON(runtimePaths.PRERENDER_MANIFEST, false);
        // Load routes manifest
        const routesManifest = await loadJSON(runtimePaths.ROUTES_MANIFEST, false);
        return {
            build: buildManifest,
            preRender: preRenderManifest,
            routes: routesManifest,
        };
    }
}
