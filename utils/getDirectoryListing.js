import fs from 'fs';
import path from 'path';

export function getDirectoryListing(dirPath) {
    const result = [];

    const walkSync = (currentPath) => {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);
            const name = path.basename(filePath);
            const type = stats.isDirectory() ? 'directory' : 'file';
            
            result.push({ type, path: filePath, name });
        });
    };

    walkSync(dirPath);
    return result;
};