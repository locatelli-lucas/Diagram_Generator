import fs from 'fs';
import { primitives, categoryTaxonomyEntities } from '../enums/enums.js';

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

function parseEntityName(line) {
    const match = line.match(/entity\s+(\w+)/);
    return match ? match[1] : null;
}

function parseAttribute(line) {
    let name, type;
    const primitiveTypes = Object.keys(primitives);
    const projectTypes = Object.keys(categoryTaxonomyEntities);
    if (line.includes(':') && !line.includes('@')) {
        let parts = line.split(':');
        name = parts[0].replace(/key/g, '').replace(/[^a-zA-Z]+/g, '');
        type = parts[1].replace(/\(.*?\)/g, '').trim();

        const matchedPrimitive = primitiveTypes.find(e => type.includes(e));
        if (matchedPrimitive) {
            type = matchedPrimitive;
        } else {
            const matchedProjectType = projectTypes.find(e => type.includes(e));
            type = matchedProjectType || type;
        }

        if(!type)
            return null;

    } else {
        name = line;
        type = null;
    }
    return { name, type };
}

function handleRelationship(type, entityName, relationships) {
    const regex = /(?:Composition\s+of\s+(?:one|many)\s+|Association\s+(?:to\s+)?(?:one\s+|many\s+)?)(\w+)/;
    const match = regex.exec(type);
    let relationshipType = '';
    if (!match) return { type, relationshipType: '', match: null };

    if (match[1] !== entityName && relationships.length > 0) {
        relationships.forEach((relationship) => {
            if (relationship.primary === match[1] && relationship.secondary === entityName) {
                if (match[0].includes('of many')) {
                    relationship.relationshipType += 'o{';
                } else if (match[0].includes('to many')) {
                    relationship.relationshipType += '|{';
                } else if (match[0].includes('to one')) {
                    relationship.relationshipType += '||';
                } else {
                    relationship.relationshipType += 'o|';
                }
            }
        });
    } else {
        if (match[0].includes('of many')) {
            relationshipType += '}o--';
        } else if (match[0].includes('to many')) {
            relationshipType += '}|--';
        } else if (match[0].includes('to one')) {
            relationshipType += '||--';
        } else {
            relationshipType += 'o|--';
        }
        relationships.push({
            primary: entityName,
            secondary: match ? match[1] : null,
            connectionType: match[0].startsWith('Association') ? 'association' : 'composition',
            relationshipType: relationshipType
        });
    }
    return { type: match[1], relationshipType, match };
}

function processEntity(e, stream, relationships, entitiesNames) {
    const lines = e.split(/\r?\n/);
    const entityName = parseEntityName(lines[0]);
    if (!entityName) return;
    stream.write(entityName + ' {\n');

    if (!entitiesNames.includes(entityName))
        entitiesNames.push(entityName);

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].replace(/;/g, '');
        if (!line.trim()) continue;
        let { name, type } = parseAttribute(line);
        if(!name || !type) continue;

        if (type && (type.includes('Association') || type.includes('Composition'))) {
            const relResult = handleRelationship(type, entityName, relationships);
            type = relResult.type;
        } else if (!type) {
            stream.write(`${line}\n`);
            continue;
        }
        stream.write(`  ${name} ${type}\n`);
    }
    stream.write('}\n');
}

export const writeFile = (output, input) => {
    fs.writeFileSync(output, '', { flag: 'w' });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: 'a' });
    const entities = splitEntities(data);
    let relationships = [];
    let entitiesNames = [];

    stream.write('erDiagram\n');

    entities.forEach((e) => {
        processEntity(e, stream, relationships, entitiesNames);
    });

    relationships.forEach(e => {
        stream.write(`  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`);
    });
}