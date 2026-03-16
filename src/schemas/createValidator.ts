import * as z from 'zod/v4';

/**
 * Wraps a Zod schema to create a validator function that also logs errors.
 *
 * @param schema The Zod schema to validate against. Should have the description meta property set.
 *
 * @returns The validated data with unknown fields stripped if valid, or undefined if invalid.
 * Note that the original data is **NOT** mutated.
 */
export function createValidator<T extends z.ZodType>(schema: T) {
    return (data: unknown, withLogs = true): z.infer<T> | undefined => {
        const result = schema.safeParse(data);
        if (withLogs && !result.success) {
            console.trace(
                `Schema validation error for ${schema.description}: ${JSON.stringify(z.flattenError(result.error))}`,
            );
            return;
        }
        return result.data;
    };
}
