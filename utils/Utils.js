import fs from "fs";
import { primitives, categoryTaxonomyEntities, paths } from "../constants/Constants.js";

const primitiveTypes = Object.keys(primitives);
const projectTypes = Object.keys(categoryTaxonomyEntities);
const globalEntities = new Map();

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

function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
};

function searchForNamespaceFile(namespace, entityName) {
    const files = getFiles(paths.CDS_FILES);

    for (const file of files) {
        const content = readFile(`${paths.CDS_FILES}${file}`);
        if (!content) continue;

        const lines = content.split(/\r?\n/);
        for (const line of lines) {
            if (line.includes("namespace") && !line.includes(namespace)) {
                break;
            }
            if (line.startsWith("namespace") && line.endsWith(`${namespace};`)) {
                const entity = searchEntityInFile(content, entityName);
                if (entity) {
                    return { entity, file };
                }
            }
        }
    }
}

function searchEntityInFile(content, entityName) {
    const entities = splitEntities(content);
    return entities.find(entity => entity.includes(`entity ${entityName}`) || entity.includes(`type ${entityName}`));
}

function splitEntities(data) {
    if (!data) {
        console.error("No data provided to split entities.");
        return [];
    }

    const entities = data.match(/entity\s+[\s\S]*?}/g) || [];
    const types = data.match(/type\s+[\s\S]*?;/g) || [];

    return entities
        .concat(types)
        .map(entity => entity.trim())
        .filter(entity => entity !== "entity" &&
            entity !== "type" &&
            !entity.includes('enum') &&
            !entity.includes('select') &&
            (entity.startsWith('entity') || entity.startsWith('type'))
        );
};

function parseEntityName(line) {
    const match = line.match(/^(entity|type)\s+(\w+)/);
    const className = match ? match[2] : null;
    const classType = match ? match[1] : null;
    return { className, classType };
}

function filterLine(line) {
    let foundName, foundType;
    let parts = line
        .replace(/[@$]\S+/g, "")
        .replace(/key|virtual|false|true|not null|null|default|odata|self|array of|localized/g, "")
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")
        .replace(/[^a-zA-Z :.]+/g, "")
        .replace(/\(.*?\)/g, "")
        .split(":");
    foundName = parts[0].trim();
    foundType = parts[1].trim();

    return { foundName, foundType, parts };
}

function parseAttribute(line, data) {
    let name, type, remanentEntity;
    if (line.includes(":")) {
        let { foundName, foundType, parts } = filterLine(line);
        name = foundName;
        type = foundType;

        if (!name || !type) return {};
        if (type.includes(" on ")) {
            type = type.split(" on ")[0].split(" ").pop();
        }
        if (type.includes("Composition") || type.includes("Association")) {
            type = type.split(" ").pop();

            if (type.includes(".")) {
                type = type.split(".").pop();
            }
        }

        const matchedPrimitive = primitiveTypes.find((e) => type === e);
        if (matchedPrimitive) {
            type = matchedPrimitive;
        } else {
            const matchedProjectType = projectTypes.find((e) => type === e);
            type = matchedProjectType || type;
        }

        if (!type ||
            (parts[1].includes('.') &&
                !data.includes(`entity ${type} `) &&
                !data.includes(`entity ${type}:`) &&
                !data.includes(`type ${type} `)) &&
            !data.includes(`type ${type}:`)) {
            let splitedType = parts[1];
            if (!splitedType && splitedType.length === 1) {
                splitedType = splitedType.split(".")[1];
            } else {
                try {
                    splitedType = splitedType.split(" ").find(part => part.includes(".")).split(".");
                } catch (error) {
                    console.error(`Error in entity ${data}, line: ${line}`);
                }
            }
            if (splitedType.length > 1) {
                type = splitedType[1];
                const namespace = splitedType[0];
                remanentEntity = searchForNamespaceFile(namespace, type);
            } else {
                return {};
            }
        }
    } else {
        name = line;
        type = null;
    }
    return { name, type, remanentEntity };
}

function getRelationshipType(matchStr) {
    const relationshipArrow = matchStr.includes("Association") ? "-->" : "*--";
    if (matchStr.includes("of many")) return `"1" ${relationshipArrow} "0..N"`;
    if (matchStr.includes("to many")) return `"0..N" ${relationshipArrow} "1"`;
    if (matchStr.includes("of one")) return `"1" ${relationshipArrow} "0..1"`;
    return `"0..1" ${relationshipArrow} "1"`;
}


function setRelationship(relationships, key, primary, secondary, matchStr) {
    let connectionLabel;

    if (matchStr.includes("Composition")) {
        connectionLabel = "composes";
    } else if (matchStr.includes("Association")) {
        connectionLabel = "associates to";
    } else {
        connectionLabel = "relates to";
    }

    if (matchStr.includes("many")) {
        connectionLabel += " many";
    } else if (matchStr.includes("one")) {
        connectionLabel += " one";
    }

    relationships.set(key, {
        primary,
        secondary,
        connectionType: connectionLabel,
        relationshipType: getRelationshipType(matchStr),
    });
}


function handleRelationship(line, className, type, relationships) {
    const compositionRegex = /Composition\s+of\s+(one|many)?\s*(\w+)?/;
    const associationRegex = /Association\s+(?:to\s+)?(one|many)?\s*(\w+)?/;
    const arrayRegex = /array\s+of\s+([^\s;]+)/;
    const match = compositionRegex.exec(line) || associationRegex.exec(line) || arrayRegex.exec(line);
    if (!match || type === className) return;

    const key = `${className}-${type}`;

    if (!relationships.has(key)) {
        setRelationship(relationships, key, className, type, line);
    }

    return { type: type, relationshipType: relationships.get(key)?.relationshipType || "", match };
}

function addEntityToGlobalMap(entityName, entity) {
    globalEntities.set(entityName, entity);
}

function processEntity(entity, stream, relationships, data, remanentEntities, isRemanentEntity) {
    const lines = entity.split(/\r?\n/);
    const { className, classType } = parseEntityName(lines[0]);

    if (globalEntities.has(className)) {
        const cachedEntity = globalEntities.get(className);
        stream.write(cachedEntity);
        return;
    }

    if (!className ||
        !classType ||
        remanentEntities &&
        remanentEntities.has(className)
    ) return;

    let cache = `class ${className} `;

    if (classType === "entity") {
        cache += "{\n"
        // stream.write("class " + className + " {\n");
    } else {
        cache += "~type~ {\n"
        // stream.write("class " + className + " ~type~ {\n");
    }

    stream.write(cache);

    for (let i = 1; i < lines.length; i++) {
        try {
            let line = lines[i].trim().replace(/;/g, "");
            if (!line.trim() ||
                (line.includes("array of") &&
                    line.includes("{")) ||
                line.startsWith("@")) {
                continue;
            }

            let { name, type, remanentEntity } = parseAttribute(line, data);
            if (!name || !type) continue;
            if (remanentEntities &&
                remanentEntity &&
                !remanentEntities.has(type)) {
                remanentEntities.set(type, { remanentEntity, printed: false });
            };

            if (!isRemanentEntity &&
                line &&
                (line.includes("Association") ||
                    line.includes("Composition") ||
                    line.includes("array of") &&
                    !primitiveTypes.includes(type))) {
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
            console.error(`${error} happend on entity ${entity} in line ${i}`)
        }
    }
    stream.write("}\n");
    cache += "}\n";

    addEntityToGlobalMap(className, cache);

    if (remanentEntities && remanentEntities.size > 0) {
        processRemanentEntities(remanentEntities, stream, relationships);
    }
}

export function processRemanentEntities(remanentEntities, stream, relationships) {
    for (const e of remanentEntities.values()) {
        if (e.printed) continue;
        const data = readFile(`${paths.CDS_FILES}${e.remanentEntity.file}`);
        processEntity(e.remanentEntity.entity, stream, relationships, data, undefined, true);
        e.printed = true;
    }
}

export function writeFile(output, input) {
    fs.writeFileSync(output, "", { flag: "w" });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: "a" });
    const entities = splitEntities(data);
    let relationships = new Map();
    let remanentEntities = new Map();

    stream.write("```mermaid\n---\nconfig:\n  look: neo\n  layout: elk\n  theme: dark\n---\nclassDiagram\n");

    entities.forEach((e) => {
        processEntity(e, stream, relationships, data, remanentEntities, false);
    });

    relationships.forEach((e) => {
        stream.write(
            `  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`
        );
    });
    stream.write("```");
};
