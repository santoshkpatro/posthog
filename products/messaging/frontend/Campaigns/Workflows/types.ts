import { z } from 'zod'

const CyclotronJobInputSchema = z.object({
    type: z.enum(['string', 'boolean', 'dictionary', 'choice', 'json', 'integration', 'integration_field', 'email']),
    key: z.string(),
    label: z.string(),
    choices: z
        .array(
            z.object({
                value: z.string(),
                label: z.string(),
            })
        )
        .optional(),
    required: z.boolean().optional(),
    default: z.any().optional(),
    secret: z.boolean().optional(),
    hidden: z.boolean().optional(),
    templating: z.boolean().optional(),
    description: z.string().optional(),
    integration: z.string().optional(),
    integration_key: z.string().optional(),
    integration_field: z.string().optional(),
    requires_field: z.string().optional(),
    requiredScopes: z.string().optional(),
})

const CyclotronJobInput = z.object({
    value: z.any(),
    templating: z.enum(['hog', 'liquid']).optional(),
    secret: z.boolean().optional(),
})

export const HogFlowSchema = z.object({
    id: z.string(),
    team_id: z.number(),
    version: z.number(),
    name: z.string(),
    status: z.enum(['active', 'draft', 'archived']),
    trigger: z.object({
        type: z.literal('event'),
        filters: z.any(),
    }),
    trigger_masking: z.object({
        ttl: z.number(),
        hash: z.string(),
        threshold: z.number(),
    }),
    conversion: z.object({
        window_minutes: z.number(),
        filters: z.any(),
    }),
    exit_condition: z.enum([
        'exit_on_conversion',
        'exit_on_trigger_not_matched',
        'exit_on_trigger_not_matched_or_conversion',
        'exit_only_at_end',
    ]),
    edges: z.array(
        z.object({
            from: z.string(),
            to: z.string(),
            type: z.enum(['continue', 'branch']),
            index: z.number(),
        })
    ),
    actions: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            type: z.enum([
                'trigger',
                'conditional_branch',
                'delay',
                'wait_for_condition',
                'message',
                'hog_function',
                'exit',
            ]),
            inputs: z.record(z.string(), CyclotronJobInput),
            inputs_schema: z.array(CyclotronJobInputSchema),
            config: z.any(),
            on_error: z.enum(['continue', 'abort', 'complete', 'branch']).optional(),
            created_at: z.number(),
            updated_at: z.number(),
        })
    ),
    abort_action: z.string().optional(),
})

export type HogFlow = z.infer<typeof HogFlowSchema>
export type HogFlowAction = HogFlow['actions'][number]
export type HogFlowEdge = HogFlow['edges'][number]
