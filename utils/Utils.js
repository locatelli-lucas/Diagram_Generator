import fs from "fs";
import { primitives, categoryTaxonomyEntities, paths } from "../constants/Constants.js";

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
                    return entity;
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

    return data
        .split(/(?=^(entity|type)\s)/gm)
        .map((entity) => entity.trim())
        .filter((entity) => entity.length > 0 && (entity.startsWith("entity") || entity.startsWith("type")));
};

function parseEntityName(line) {
    const match = line.match(/^(entity|type)\s+(\w+)/);
    const className = match ? match[2] : null;
    const classType = match ? match[1] : null;
    return { className, classType };
}

function parseAttribute(line, data) {
    let name, type, remanentEntity;
    const primitiveTypes = Object.keys(primitives);
    const projectTypes = Object.keys(categoryTaxonomyEntities);
    if (line.includes(":")) {
        let parts = line
            .replace(/key/g, "")
            .replace(/virtual|not null|null|default|odata|self|array of/g, "")
            .replace(/[^a-zA-Z :.]+/g, "")
            .replace(/\(.*?\)/g, "")
            .replace(/not null|null/g, "")
            .replace(/default/g, "")
            .split(":");
        name = parts[0].trim();
        type = parts[1].trim().split(' on ')[0].split(" ").pop();

        if (!name) return {};

        const matchedPrimitive = primitiveTypes.find((e) => type.includes(e));
        if (matchedPrimitive) {
            type = matchedPrimitive;
        } else {
            const matchedProjectType = projectTypes.find((e) => type === e);
            type = matchedProjectType || type;
        }

        if (!type || (parts[1].includes('.') && !data.includes(`entity ${type}`) && !data.includes(`type ${type}`))) {
            const splitedType = parts[1].split('.');
            if (splitedType.length > 1) {
                type = splitedType[1];
                const namespace = splitedType[0].split(" ").pop();
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

function processEntity(entity, stream, relationships, data) {
    if (entity.includes("select") || entity.includes("enum")) return;
    const lines = entity.split(/\r?\n/);
    const { className, classType } = parseEntityName(lines[0]);
    if (!className || !classType) return;
    if (classType === "entity") {
        stream.write("class " + className + " {\n");
    } else {
        stream.write("class " + className + " ~type~ {\n");
    }

    let remanentEntities = new Set();

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].replace(/;/g, "");
        if (!line.trim() || (line.includes("array of") && line.includes("{"))) continue;
        let { name, type, remanentEntity } = parseAttribute(line, data);
        if (!name || !type) continue;
        if (remanentEntity) {
            remanentEntities.add(remanentEntity);
        };

        const primitiveTypes = Object.keys(primitives)

        if (line && (line.includes("Association") || line.includes("Composition") || line.includes("array of") && !primitiveTypes.includes(type))) {
            const relResult = handleRelationship(line, className, type, relationships);

            if (relResult == null) continue;

            type = relResult.type;
        } else if (!type) {
            stream.write(`${line}\n`);
            continue;
        }
        stream.write(`  ${name} : ${type}\n`);
    }
    stream.write("}\n");

    if (remanentEntities.length > 0) {
        for (const e of remanentEntities) {
            processEntity(e, stream, relationships);
        }
    }
}

export function writeFile(output, input) {
    fs.writeFileSync(output, "", { flag: "w" });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: "a" });
    const entities = splitEntities(data);
    let relationships = new Map();

    stream.write("```mermaid\n---\nconfig:\n  look: neo\n  layout: elk\n  theme: dark\n---\nclassDiagram\n");

    entities.forEach((e) => {
        processEntity(e, stream, relationships, data);
    });

    relationships.forEach((e) => {
        stream.write(
            `  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`
        );
    });
    stream.write("```");
};
