import fs from "fs";
import { primitives, categoryTaxonomyEntities, paths } from "../constants/Constants.js";
import path from "path";

const primitiveTypes = Object.keys(primitives);
const projectTypes = Object.keys(categoryTaxonomyEntities);
const globalEntities = new Map();

// Reads directory and returns only .cds files
export function getFiles(path) {
    try {
        const files = fs.readdirSync(path);
        const filteredFiles = files.filter(file => file.endsWith(".cds"));
        return filteredFiles;
    } catch (err) {
        console.error("Error reading directory:", err);
        return [];
    }
}

// Reads file content synchronously and returns as string
function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
};

// Searches for an entity in files matching the given namespace
function searchForNamespaceFile(namespace, entityName) {
    const cdsFiles = getFiles(paths.CDS_FILES);

    for (const fileName of cdsFiles) {
        const fileContent = readFile(`${paths.CDS_FILES}${fileName}`);
        const namespaceMatch = fileContent.match(/namespace\s+([\w.]+);/);

        if (!fileContent || 
            !namespaceMatch || 
            !namespaceMatch[1].endsWith(namespace)) {
            continue;
        }
        
        const foundEntity = searchEntityInFile(fileContent, entityName);
        if (foundEntity) {
            return { entity: foundEntity, file: fileName };
        }
    }
}

// Finds a specific entity definition within file content
function searchEntityInFile(content, entityName) {
    const entities = splitEntities(content);
    return entities.find(entity => entity.includes(`entity ${entityName}`) || entity.includes(`type ${entityName}`));
}

// Splits CDS content into individual entity and type definitions
function splitEntities(data) {
    if (!data) {
        console.error("No data provided to split entities.");
        return [];
    }

    const entityMatches = data.match(/entity\s+[\s\S]*?}/g) || [];
    const typeMatches = data.match(/type\s+[\s\S]*?;/g) || [];

    return entityMatches
        .concat(typeMatches)
        .map(entityDefinition => entityDefinition.trim())
        .filter(entityDefinition => entityDefinition !== "entity" &&
            entityDefinition !== "type" &&
            !entityDefinition.includes('enum') &&
            !entityDefinition.includes('select') &&
            (entityDefinition.startsWith('entity') || entityDefinition.startsWith('type'))
        );
};

// Parses entity name and type from the first line of definition
function parseEntityName(line) {
    const match = line.match(/^(entity|type)\s+(\w+)/);
    const className = match ? match[2] : null;
    const classType = match ? match[1] : null;
    return { className, classType };
}

// Removes CDS annotations and comments from a line
function removeAnnotationsAndComments(line) {
    return line
        .replace(/[@$]\S+/g, "")
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
}

// Removes CDS keywords from a line
function removeKeywords(line) {
    return line.replace(/key|virtual|false|true|not null|null|default|odata|self|array of|localized/g, "");
}

// Cleans line from special characters and splits by colon
function cleanAndSplit(line) {
    return line
        .replace(/[^a-zA-Z :.]+/g, "")
        .replace(/\(.*?\)/g, "")
        .split(":");
}

// Filters and parses attribute line to extract name and type
function filterLine(line) {
    let attributeName, attributeType, lineParts;
    line = removeAnnotationsAndComments(line);
    line = removeKeywords(line);
    lineParts = cleanAndSplit(line);

    attributeName = lineParts[0].trim();
    attributeType = lineParts[1].trim();

    return { foundName: attributeName, foundType: attributeType, parts: lineParts };
}

// Searches for type definition in data or external files
function findTypeInData(type, data, parts) {
    let remainingEntity;
    if (!type || (parts[1].includes('.') && !data.includes(`entity ${type} `) && !data.includes(`entity ${type}:`) && !data.includes(`type ${type} `)) && !data.includes(`type ${type}:`)) {
        let splittedType = parts[1];
        if (!splittedType && splittedType.length === 1) {
            splittedType = splittedType.split(".")[1];
        } else {
            try {
                splittedType = splittedType.split(" ").find(part => part.includes(".")).split(".");
            } catch (error) {
                console.error(`Error in entity ${data}, line: ${line}`);
            }
        }
        if (splittedType.length > 1) {
            type = splittedType[1];
            const namespace = splittedType[0];
            remainingEntity = searchForNamespaceFile(namespace, type);
        } else {
            return {};
        }
    }
    return { type, remanentEntity: remainingEntity };
}

// Matches type against primitive or project types
function matchType(type, data, parts) {
    const matchedPrimitive = primitiveTypes.find((primitiveType) => type === primitiveType);
    if (matchedPrimitive) {
        type = matchedPrimitive;
    } else {
        const matchedProjectType = projectTypes.find((projectType) => type === projectType);
        type = matchedProjectType || type;
    }
    return findTypeInData(type, data, parts);
}

// Extracts base type from Composition or Association declarations
function extractTypeFromCompositionOrAssociation(type) {
    if (type.includes("Composition") || type.includes("Association")) {
        type = type.split(" ").pop();
        if (type.includes(".")) {
            type = type.split(".").pop();
        }
    }
    return type;
}

// Extracts type from "on" clause in CDS definitions
function extractTypeFromOnClause(type) {
    if (type.includes(" on ")) {
        return type.split(" on ")[0].split(" ").pop();
    }
    return type;
}

// Parses type definitions and applies transformations
function parseType(type, data, parts) {
    type = extractTypeFromOnClause(type);
    type = extractTypeFromCompositionOrAssociation(type);

    return matchType(type, data, parts);
}

// Parses attribute definition line and extracts name, type and relationships
function parseAttribute(line, data) {
    let name, type, remainingEntity;
    if (line.includes(":")) {
        let { foundName, foundType, parts } = filterLine(line);
        name = foundName;
        type = foundType;

        if (!name || !type) return {};

        const parseTypeResult = parseType(type, data, parts);
        type = parseTypeResult.type;
        remainingEntity = parseTypeResult.remanentEntity;
    } else {
        name = line;
        type = null;
    }
    return { name, type, remanentEntity: remainingEntity };
}

// Determines relationship arrow type based on cardinality
function getRelationshipType(relationshipMatch) {
    const relationshipArrow = relationshipMatch.includes("Association") ? "-->" : "--";
    if (relationshipMatch.includes("of many")) return `"1" ${relationshipArrow} "N"`;
    if (relationshipMatch.includes("to many")) return `"N" ${relationshipArrow} "1"`;
    if (relationshipMatch.includes("of one")) return `"1" ${relationshipArrow} "1"`;
    return `"1" ${relationshipArrow} "1"`;
}


// Creates and stores relationship information between entities
function setRelationship(relationships, key, primary, secondary, relationshipMatch) {
    let connectionLabel;

    if (relationshipMatch.includes("Composition")) {
        connectionLabel = "composes";
    } else if (relationshipMatch.includes("Association")) {
        connectionLabel = "associates to";
    } else {
        connectionLabel = "relates to";
    }

    if (relationshipMatch.includes("many")) {
        connectionLabel += " many";
    } else if (relationshipMatch.includes("one")) {
        connectionLabel += " one";
    }

    relationships.set(key, {
        primary,
        secondary,
        connectionType: connectionLabel,
        relationshipType: getRelationshipType(relationshipMatch),
    });
}


// Handles relationship parsing and registration for entity connections
function handleRelationship(line, className, type, relationships) {
    const compositionRegex = /Composition\s+of\s+(one|many)?\s*(\w+)?/;
    const associationRegex = /Association\s+(?:to\s+)?(one|many)?\s*(\w+)?/;
    const arrayRegex = /array\s+of\s+([^\s;]+)/;
    const regexMatch = compositionRegex.exec(line) || associationRegex.exec(line) || arrayRegex.exec(line);
    if (!regexMatch || type === className) return;

    const relationshipKey = `${className}-${type}`;

    if (!relationships.has(relationshipKey)) {
        setRelationship(relationships, relationshipKey, className, type, line);
    }

    return { type: type, relationshipType: relationships.get(relationshipKey)?.relationshipType || "", match: regexMatch };
}

// Adds entity to global cache for reuse
function addEntityToGlobalMap(entityName, entity) {
    globalEntities.set(entityName, entity);
}

// Writes entity header with appropriate class syntax for Mermaid
function writeEntityHeader(stream, className, classType) {
    let cache = `class ${className} `;
    if (classType === "entity") {
        cache += "{\n"
    } else {
        cache += "~type~ {\n"
    }
    stream.write(cache);
    return cache;
}

// Processes all attributes of an entity and writes them to stream
function processEntityAttributes(lines, stream, className, data, relationships, remanentEntities, isRemanentEntity) {
    let cache = "";
    for (let i = 1; i < lines.length; i++) {
        try {
            let line = lines[i].trim().replace(/;/g, "");
            if (!line.trim() || (line.includes("array of") && line.includes("{")) || line.startsWith("@")) {
                continue;
            }

            let { name, type, remanentEntity } = parseAttribute(line, data);

            if (!name || !type) continue;
            if (remanentEntities && remanentEntity && !remanentEntities.has(type)) {
                remanentEntities.set(
                    type,
                    {
                        remanentEntity,
                        printed: false
                    }
                );
            }

            if (line && (line.includes("Association") || line.includes("Composition") || line.includes("array of") && !primitiveTypes.includes(type))) {
                const relResult = handleRelationship(line, className, type, relationships);

                if (relResult == null) {
                    stream.write(`  ${name} : ${type}\n`);
                    cache += `  ${name} : ${type}\n`;
                    continue;
                }
                type = relResult.type;
            } else if (!type) {
                stream.write(`${line}\n`);
                cache += `${line}\n`;
                continue;
            }
            stream.write(`  ${name} : ${type}\n`);
            cache += `  ${name} : ${type}\n`;
        } catch (error) {
            console.error(`${error} happened on entity ${className} in line ${i}`)
        }
    }
    return cache;
}

// Finalizes entity definition by closing brackets and caching
function finalizeEntity(stream, className, cache) {
    stream.write("}\n");
    cache += "}\n";
    addEntityToGlobalMap(className, cache);
}

// Processes a complete entity definition and writes to Mermaid stream
function processEntity(entity, stream, relationships, data, remanentEntities, isRemanentEntity) {
    const lines = entity.split(/\r?\n/);
    const { className, classType } = parseEntityName(lines[0]);

    if (!className || !classType || (remanentEntities && remanentEntities.has(className))) return;

    let cache = writeEntityHeader(stream, className, classType);
    const attributesCache = processEntityAttributes(lines, stream, className, data, relationships, remanentEntities, isRemanentEntity);
    cache += attributesCache;
    finalizeEntity(stream, className, cache);

    if (remanentEntities && remanentEntities.size > 0) {
        processRemanentEntities(remanentEntities, stream, relationships);
    }
}

// Processes entities that were referenced but not yet defined
export function processRemanentEntities(remanentEntities, stream, relationships) {
    for (const entityEntry of remanentEntities.values()) {
        if (entityEntry.printed) continue;
        const fileContent = readFile(`${paths.CDS_FILES}${entityEntry.remanentEntity.file}`);
        processEntity(entityEntry.remanentEntity.entity, stream, relationships, fileContent, undefined, true);
        entityEntry.printed = true;
    }
}

// Main function that converts CDS file to Mermaid class diagram
export function writeFile(output, input) {
    fs.writeFileSync(output, "", { flag: "w" });
    const fileContent = readFile(input);
    const stream = fs.createWriteStream(output, { flags: "a" });
    const entities = splitEntities(fileContent);
    let relationships = new Map();
    let remanentEntities = new Map();

    stream.write(`\`\`\`mermaid\n---\ntitle: ${path.basename(input)}\nconfig:\n  look: neo\n  layout: elk\n  theme: dark\n---\nclassDiagram\n`);

    entities.forEach((entityDefinition) => {
        processEntity(entityDefinition, stream, relationships, fileContent, remanentEntities, false);
    });

    relationships.forEach((relationshipData) => {
        if (!globalEntities.has(relationshipData.secondary)) return;
        stream.write(
            `  ${relationshipData.primary} ${relationshipData.relationshipType} ${relationshipData.secondary} : ${relationshipData.connectionType}\n`
        );
    });
    stream.write("```");
};
