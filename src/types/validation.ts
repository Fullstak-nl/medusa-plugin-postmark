export type ValidationResult = {
    templateId: string
    templateName?: string
    missingVariables?: Record<string, any>
    providedData?: Record<string, any> | null
}

export type ValidationResponse = {
    success: boolean
    message: string
    results: ValidationResult[]
}
