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
    if (matchStr.includes("of many")) return "}o--";
    if (matchStr.includes("to many")) return "}|--";
    if (matchStr.includes("to one")) return "||--";
    return "o|--";
}

function getReverseRelationshipType(matchStr) {
    if (matchStr.includes("of many")) return "o{";
    if (matchStr.includes("to many")) return "|{";
    if (matchStr.includes("to one")) return "||";
    return "o|";
}

function setRelationship(relationships, key, primary, secondary, matchStr) {
    relationships.set(key, {
        primary,
        secondary,
        connectionType: matchStr.startsWith("Association") ? "association" : "composition",
        relationshipType: getRelationshipType(matchStr),
    });
}

function updateReverseRelationship(relationships, key, matchStr, primary, secondary) {
    const rel = relationships.get(key);
    if (rel && rel.primary === primary && rel.secondary === secondary) {
        rel.relationshipType += getReverseRelationshipType(matchStr);
    }
}

function handleRelationship(line, entityName, relationships) {
    const regex = /(?:Composition\s+of\s+(?:one|many)\s+|Association\s+(?:to\s+)?(?:one\s+|many\s+)?)(\w+)/;
    const match = regex.exec(line);
    if (!match) return { line, relationshipType: "", match: null };

    const key = `${entityName}-${match[1]}`;
    const reverseKey = `${match[1]}-${entityName}`;

    if (!relationships.has(key)) {
        setRelationship(relationships, key, entityName, match[1], match[0]);
    }

    updateReverseRelationship(relationships, reverseKey, match[0], match[1], entityName);

    return { type: match[1], relationshipType: relationships.get(key)?.relationshipType || "", match };
}

function processEntity(e, stream, relationships) {
    const lines = e.split(/\r?\n/);
    const entityName = parseEntityName(lines[0]);
    if (!entityName) return;
    stream.write(entityName + " {\n");

    // entitiesNames.add(entityName);

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].replace(/;/g, "");
        if (!line.trim()) continue;
        let { name, type } = parseAttribute(line);
        if (!name || !type) continue;

        if (
            line &&
            (line.includes("Association") || line.includes("Composition"))
        ) {
            const relResult = handleRelationship(line, entityName, relationships);
            type = relResult.type;
        } else if (!type) {
            stream.write(`${line}\n`);
            continue;
        }
        stream.write(`  ${name} ${type}\n`);
    }
    stream.write("}\n");
}

export const writeFile = (output, input) => {
    fs.writeFileSync(output, "", { flag: "w" });
    const data = readFile(input);
    const stream = fs.createWriteStream(output, { flags: "a" });
    const entities = splitEntities(data);
    let relationships = new Map();
    let entitiesNames = new Set();

    stream.write("erDiagram\n");

    entities.forEach((e) => {
        processEntity(e, stream, relationships);
    });

    relationships.forEach((e) => {
        stream.write(
            `  ${e.primary} ${e.relationshipType} ${e.secondary} : ${e.connectionType}\n`
        );
    });
};
