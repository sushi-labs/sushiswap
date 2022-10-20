export function finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten) {
    if (type == null) {
        type = 'upload';
    }
    if (url_suffix != null) {
        if (resource_type === 'image' && type === 'upload') {
            resource_type = "images";
            type = null;
        }
        else if (resource_type === 'image' && type === 'private') {
            resource_type = 'private_images';
            type = null;
        }
        else if (resource_type === 'image' && type === 'authenticated') {
            resource_type = 'authenticated_images';
            type = null;
        }
        else if (resource_type === 'raw' && type === 'upload') {
            resource_type = 'files';
            type = null;
        }
        else if (resource_type === 'video' && type === 'upload') {
            resource_type = 'videos';
            type = null;
        }
        else {
            throw new Error("URL Suffix only supported for image/upload, image/private, image/authenticated, video/upload and raw/upload");
        }
    }
    if (use_root_path) {
        if ((resource_type === 'image' && type === 'upload') || (resource_type === 'images' && (type == null))) {
            resource_type = null;
            type = null;
        }
        else {
            throw new Error("Root path only supported for image/upload");
        }
    }
    if (shorten && resource_type === 'image' && type === 'upload') {
        resource_type = 'iu';
        type = null;
    }
    return [resource_type, type];
}
