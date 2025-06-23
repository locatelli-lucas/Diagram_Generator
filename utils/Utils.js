import fs from 'fs';

export const readFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};

export const splitEntities = (data) => {
    if(!data) {
        console.error('No data provided to split entities.');
        return [];
    }

    return data
        .split(/(?=^entity\s)/gm)
        .map(entity => entity.trim())
        .filter(entity => entity.length > 0 && entity.startsWith("entity"));
}

export const writeFile = (output, input) => {
    fs.writeFileSync(output, '', { flag: 'w' });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: 'a' });
    const arrayOfEntities = splitEntities(data);
    console.log(arrayOfEntities)

    stream.write('erDiagram\n')

    arrayOfEntities.forEach((e, index) => {
        const lines = e.split(/\r?\n/);
        const entityName = lines[0].match(/entity\s+(\w+)/);        
        stream.write(entityName[1] + ' {\n');
        
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            let type;
            let name;
            if(line.includes(':')) {
                line = line.split(':')
                type = line[0].replace(/key/g, '').replace(/[^a-zA-Z]+/g, '');
                name = line[1].replace(/\(.*?\)/g, '');
            } else {
                stream.write(`${line}\n`);
                continue;
            }
            stream.write(`  ${type} ${name}\n`);
            
        } 
        
    });
}