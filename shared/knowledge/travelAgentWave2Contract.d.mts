// The audited core has an unknown boundary; consumers must validate its output.
export function reconstruct(query: string, input: unknown, fixture: unknown): unknown;
export function validateAnswer(answer: unknown, query: string, input: unknown, fixture: unknown): true;
