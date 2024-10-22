// services/fileService.js
import fs from 'fs';

const fileService = {
    readFiles: () => {
        // Logic to read files from a directory or database
        return fs.readdirSync('./files').map(file => ({
            name: file,
            content: fs.readFileSync(`./files/${file}`, 'utf8'),
        }));
    },
    
    writeFile: (name, content) => {
        fs.writeFileSync(`./files/${name}`, content);
    },
    
    deleteFile: (name) => {
        fs.unlinkSync(`./files/${name}`);
    },
};

// Exporting the fileService object using ES6 syntax
export default fileService;
