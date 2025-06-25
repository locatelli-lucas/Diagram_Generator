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
    if (!data) {
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
    const entities = splitEntities(data);
    let relationships = [];
    let entitiesNames = [];

    stream.write('erDiagram\n')

    entities.forEach((e) => {
        const lines = e.split(/\r?\n/);
        const entityName = lines[0].match(/entity\s+(\w+)/);
        stream.write(entityName[1] + ' {\n');

        if (!entitiesNames.includes(entityName[1]))
            entitiesNames.push(entityName[1]);

        for (let i = 1; i < lines.length; i++) {
            let line = lines[i].replace(/;/g, '');
            let type;
            let name;

            if (line.includes(':')) {
                line = line.split(':')
                name = line[0].replace(/key/g, '').replace(/[^a-zA-Z]+/g, '');
                type = line[1].replace(/\(.*?\)/g, '');
                if (type.includes('Association') || type.includes('Composition')) {
                    const regex = /(?:Composition\s+of\s+(?:one|many)\s+|Association\s+(?:to\s+)?(?:one\s+|many\s+)?)(\w+)/;
                    const match = regex.exec(type);
                    let relationshipType = '';

                    if (match[1] != entityName[1] && relationships.length > 0) {
                        relationships.forEach((relationship) => {
                            if (relationship.primary === match[1] && relationship.secondary === entityName[1]) {
                                if (match[0].includes('of many')) {
                                    relationship.relationshipType += 'o{'
                                } else if (match[0].includes('to many'))
                                    relationship.relationshipType += '|{';
                                else if (match[0].includes('to one')) {
                                    relationship.relationshipType += '||';
                                } else {
                                    relationship.relationshipType += 'o|';
                                }
                            }
                        })
                    } else {
                        if (match[0].includes('of many')) {
                            relationshipType += '}o--'
                        } else if (match[0].includes('to many'))
                            relationshipType += '}|--';
                        else if (match[0].includes('to one')) {
                            relationshipType += '||--';
                        } else {
                            relationshipType += 'o|--';
                        }
                        relationships.push(
                            {
                                primary: entityName[1],
                                secondary: match ? match[1] : null,
                                connectionType: match[0].startsWith('Association') ? 'association' : 'composition',
                                relationshipType: relationshipType
                            }
                        );
                    }
                    type = match[1];
                }
            } else {
                stream.write(`${line}\n`);
                continue;
            }
            stream.write(`  ${name} ${type}\n`);
        }

    });
    relationships.forEach(e => {
        stream.write(`  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`);
    })
}