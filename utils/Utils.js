import fs from "fs";
import { primitives, categoryTaxonomyEntities } from "../enums/enums.js";

export const readFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
};

export const splitEntities = (data) => {
    if (!data) {
        console.error("No data provided to split entities.");
        return [];
    }

    return data
        .split(/(?=^entity\s)/gm)
        .map((entity) => entity.trim())
        .filter((entity) => entity.length > 0 && entity.startsWith("entity"));
};

function parseEntityName(line) {
    const match = line.match(/entity\s+(\w+)/);
    return match ? match[1] : null;
}

function parseAttribute(line) {
    let name, type;
    const primitiveTypes = Object.keys(primitives);
    const projectTypes = Object.keys(categoryTaxonomyEntities);
    if (line.includes(":") && !line.includes("@")) {
        let parts = line.split(":");
        name = parts[0]
            .replace(/key/g, "")
            .replace(/virtual/g, "")
            .replace(/[^a-zA-Z]+/g, "");
        type = parts[1].replace(/\(.*?\)/g, "").trim();

        const matchedPrimitive = primitiveTypes.find((e) => type.includes(e));
        if (matchedPrimitive) {
            type = matchedPrimitive;
        } else {
            const matchedProjectType = projectTypes.find((e) => type.includes(e));
            type = matchedProjectType || type;
        }

        if (!type) return null;
    } else {
        name = line;
        type = null;
    }
    return { name, type };
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


function handleRelationship(line, entityName, relationships) {
    const compositionRegex = /Composition\s+of\s+(one|many)\s+(\w+)/;
    const associationRegex = /Association\s+(?:to\s+)?(one|many)\s+(\w+)/;
    const arrayRegex = /array\s+of\s+(\w+)/;
    const match = compositionRegex.exec(line) || associationRegex.exec(line) || arrayRegex.exec(line);
    if (!match || match[2] === entityName) return;

    const key = `${entityName}-${match[2]}`;

    if (!relationships.has(key)) {
        setRelationship(relationships, key, entityName, match[2], match[0]);
    }

    return { type: match[2], relationshipType: relationships.get(key)?.relationshipType || "", match };
}

function processEntity(entity, stream, relationships) {
    if(entity.includes("select")) return;
    const lines = entity.split(/\r?\n/);
    const entityName = parseEntityName(lines[0]);
    if (!entityName) return;
    stream.write("class " + entityName + " {\n");

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].replace(/;/g, "");
        if (!line.trim()) continue;
        let { name, type } = parseAttribute(line);
        if (!name || !type) continue;

        if (
            line &&
            (line.includes("Association") || line.includes("Composition") || line.includes("array of"))
        ) {
            const relResult = handleRelationship(line, entityName, relationships);

            if(relResult == null) continue;

            type = relResult.type;
        } else if (!type) {
            stream.write(`${line}\n`);
            continue;
        }
        stream.write(`  ${name} : ${type}\n`);
    }
    stream.write("}\n");
}

export const writeFile = (output, input) => {
    fs.writeFileSync(output, "", { flag: "w" });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: "a" });
    const entities = splitEntities(data);
    let relationships = new Map();

    stream.write("```mermaid\n---\nconfig:\n  look: neo\n  layout: elk\n  theme: dark\n---\nclassDiagram\n");

    entities.forEach((e) => {
        processEntity(e, stream, relationships);
    });

    relationships.forEach((e) => {
        stream.write(
            `  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`
        );
    });
    stream.write("```");
};
