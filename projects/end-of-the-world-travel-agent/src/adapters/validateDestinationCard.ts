import type { DestinationCard } from "../domain/types.js";

export interface ValidationError {
  path: string;
  violation: "missing" | "type" | "range" | "format";
  message: string;
}

export type ValidationResult =
  | { valid: true; card: DestinationCard }
  | { valid: false; errors: ValidationError[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsoDate(value: string): boolean {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(value);
  if (!match) return false;
  const date = new Date(value + "T00:00:00Z");
  return !isNaN(date.getTime());
}

function isFutureDate(value: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value + "T00:00:00Z");
  return date.getTime() > today.getTime();
}

export function validateDestinationCard(raw: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isObject(raw)) {
    errors.push({ path: "(root)", violation: "type", message: "Expected an object" });
    return { valid: false, errors };
  }

  // Required string fields
  const stringFields = ["id", "name", "region", "comuna", "summary", "verifiedAt"] as const;
  for (const field of stringFields) {
    if (!(field in raw)) {
      errors.push({ path: field, violation: "missing", message: `Field "${field}" is required` });
    } else if (!isNonEmptyString(raw[field])) {
      errors.push({ path: field, violation: "type", message: `Field "${field}" must be a non-empty string` });
    }
  }

  // verifiedAt format and future check
  if (isNonEmptyString(raw["verifiedAt"])) {
    if (!isValidIsoDate(raw["verifiedAt"])) {
      errors.push({ path: "verifiedAt", violation: "format", message: "Field \"verifiedAt\" must be a valid ISO 8601 date (YYYY-MM-DD)" });
    } else if (isFutureDate(raw["verifiedAt"])) {
      errors.push({ path: "verifiedAt", violation: "format", message: "Field \"verifiedAt\" must not be a future date" });
    }
  }

  // coordinates
  if (!("coordinates" in raw)) {
    errors.push({ path: "coordinates", violation: "missing", message: "Field \"coordinates\" is required" });
  } else if (!isObject(raw["coordinates"])) {
    errors.push({ path: "coordinates", violation: "type", message: "Field \"coordinates\" must be an object" });
  } else {
    const coords = raw["coordinates"];
    if (typeof coords["latitude"] !== "number") {
      errors.push({ path: "coordinates.latitude", violation: "type", message: "Field \"coordinates.latitude\" must be a number" });
    } else if (coords["latitude"] < -90 || coords["latitude"] > 90) {
      errors.push({ path: "coordinates.latitude", violation: "range", message: "Field \"coordinates.latitude\" must be between -90 and 90" });
    }
    if (typeof coords["longitude"] !== "number") {
      errors.push({ path: "coordinates.longitude", violation: "type", message: "Field \"coordinates.longitude\" must be a number" });
    } else if (coords["longitude"] < -180 || coords["longitude"] > 180) {
      errors.push({ path: "coordinates.longitude", violation: "range", message: "Field \"coordinates.longitude\" must be between -180 and 180" });
    }
  }

  // stableData
  if (!("stableData" in raw)) {
    errors.push({ path: "stableData", violation: "missing", message: "Field \"stableData\" is required" });
  } else if (!isObject(raw["stableData"])) {
    errors.push({ path: "stableData", violation: "type", message: "Field \"stableData\" must be an object" });
  } else {
    const sd = raw["stableData"];
    if (!isNonEmptyString(sd["geographicContext"])) {
      errors.push({ path: "stableData.geographicContext", violation: "missing", message: "Field \"stableData.geographicContext\" is required and must be a non-empty string" });
    }
    if (!isNonEmptyString(sd["culturalContext"])) {
      errors.push({ path: "stableData.culturalContext", violation: "missing", message: "Field \"stableData.culturalContext\" is required and must be a non-empty string" });
    }
  }

  // warnings
  if (!("warnings" in raw)) {
    errors.push({ path: "warnings", violation: "missing", message: "Field \"warnings\" is required" });
  } else if (!Array.isArray(raw["warnings"])) {
    errors.push({ path: "warnings", violation: "type", message: "Field \"warnings\" must be an array" });
  } else {
    for (let i = 0; i < raw["warnings"].length; i++) {
      if (typeof raw["warnings"][i] !== "string") {
        errors.push({ path: `warnings[${i}]`, violation: "type", message: `Element warnings[${i}] must be a string` });
      }
    }
  }

  // sources
  if (!("sources" in raw)) {
    errors.push({ path: "sources", violation: "missing", message: "Field \"sources\" is required" });
  } else if (!Array.isArray(raw["sources"])) {
    errors.push({ path: "sources", violation: "type", message: "Field \"sources\" must be an array" });
  } else {
    if (raw["sources"].length === 0) {
      errors.push({ path: "sources", violation: "missing", message: "Field \"sources\" must contain at least one element" });
    }
    for (let i = 0; i < raw["sources"].length; i++) {
      const source = raw["sources"][i];
      if (!isObject(source)) {
        errors.push({ path: `sources[${i}]`, violation: "type", message: `Element sources[${i}] must be an object` });
        continue;
      }
      if (!isNonEmptyString(source["title"])) {
        errors.push({ path: `sources[${i}].title`, violation: "missing", message: `Field "sources[${i}].title" is required` });
      }
      if (!isNonEmptyString(source["publisher"])) {
        errors.push({ path: `sources[${i}].publisher`, violation: "missing", message: `Field "sources[${i}].publisher" is required` });
      }
      if (!isNonEmptyString(source["url"])) {
        errors.push({ path: `sources[${i}].url`, violation: "missing", message: `Field "sources[${i}].url" is required` });
      }
      if (!isNonEmptyString(source["verifiedAt"])) {
        errors.push({ path: `sources[${i}].verifiedAt`, violation: "missing", message: `Field "sources[${i}].verifiedAt" is required` });
      } else if (!isValidIsoDate(source["verifiedAt"] as string)) {
        errors.push({ path: `sources[${i}].verifiedAt`, violation: "format", message: `Field "sources[${i}].verifiedAt" must be a valid ISO 8601 date (YYYY-MM-DD)` });
      }
    }
  }

  // suggestedInternalLinks
  if (!("suggestedInternalLinks" in raw)) {
    errors.push({ path: "suggestedInternalLinks", violation: "missing", message: "Field \"suggestedInternalLinks\" is required" });
  } else if (!Array.isArray(raw["suggestedInternalLinks"])) {
    errors.push({ path: "suggestedInternalLinks", violation: "type", message: "Field \"suggestedInternalLinks\" must be an array" });
  } else {
    for (let i = 0; i < raw["suggestedInternalLinks"].length; i++) {
      const link = raw["suggestedInternalLinks"][i];
      if (!isObject(link)) {
        errors.push({ path: `suggestedInternalLinks[${i}]`, violation: "type", message: `Element suggestedInternalLinks[${i}] must be an object` });
        continue;
      }
      if (!isNonEmptyString(link["path"])) {
        errors.push({ path: `suggestedInternalLinks[${i}].path`, violation: "missing", message: `Field "suggestedInternalLinks[${i}].path" is required` });
      } else if (!(link["path"] as string).startsWith("/")) {
        errors.push({ path: `suggestedInternalLinks[${i}].path`, violation: "format", message: `Field "suggestedInternalLinks[${i}].path" must start with "/"` });
      }
      if (!isNonEmptyString(link["label"])) {
        errors.push({ path: `suggestedInternalLinks[${i}].label`, violation: "missing", message: `Field "suggestedInternalLinks[${i}].label" is required` });
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, card: raw as unknown as DestinationCard };
}
