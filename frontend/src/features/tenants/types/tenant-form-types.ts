export interface TenantFormValues {
    name: string;
    active: boolean;
    demo: boolean;
}

export interface TenantUpdateRequest extends TenantFormValues {
    tenantId: string;
}
