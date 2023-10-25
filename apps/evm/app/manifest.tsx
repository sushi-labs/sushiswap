import {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "Sushi",
        "description": "Earn, stream and automate your DAO salaries and token vesting with Furo.",
        "short_name": "Sushi",
        "display": "standalone",
        "orientation": "portrait",
        "theme_color": "#f4f5f6",
        "background_color": "#f4f5f6",
        "id": "/",
        "start_url": "./",
        "scope": "./",
        "icons": [
            {
                "src": "icon-512x512.svg?v=1",
                "sizes": "512x512",
                "type": "image/svg+xml"
            },
            {
                "src": "icon-192x192.png?v=1",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "icon-512x512.png?v=1",
                "sizes": "512x512",
                "type": "image/png"
            },
            {
                "src": "maskable-icon-128x128.png?v=1",
                "sizes": "128x128",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "maskable-icon-192x192.png?v=1",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "maskable-icon-384x384.png?v=1",
                "sizes": "384x384",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "maskable-icon-512x512.png?v=1",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            }
        ]
    }

}
