export declare enum ChangeType {
    FieldArgumentDescriptionChanged = "FIELD_ARGUMENT_DESCRIPTION_CHANGED",
    FieldArgumentDefaultChanged = "FIELD_ARGUMENT_DEFAULT_CHANGED",
    FieldArgumentTypeChanged = "FIELD_ARGUMENT_TYPE_CHANGED",
    DirectiveRemoved = "DIRECTIVE_REMOVED",
    DirectiveAdded = "DIRECTIVE_ADDED",
    DirectiveDescriptionChanged = "DIRECTIVE_DESCRIPTION_CHANGED",
    DirectiveLocationAdded = "DIRECTIVE_LOCATION_ADDED",
    DirectiveLocationRemoved = "DIRECTIVE_LOCATION_REMOVED",
    DirectiveArgumentAdded = "DIRECTIVE_ARGUMENT_ADDED",
    DirectiveArgumentRemoved = "DIRECTIVE_ARGUMENT_REMOVED",
    DirectiveArgumentDescriptionChanged = "DIRECTIVE_ARGUMENT_DESCRIPTION_CHANGED",
    DirectiveArgumentDefaultValueChanged = "DIRECTIVE_ARGUMENT_DEFAULT_VALUE_CHANGED",
    DirectiveArgumentTypeChanged = "DIRECTIVE_ARGUMENT_TYPE_CHANGED",
    EnumValueRemoved = "ENUM_VALUE_REMOVED",
    EnumValueAdded = "ENUM_VALUE_ADDED",
    EnumValueDescriptionChanged = "ENUM_VALUE_DESCRIPTION_CHANGED",
    EnumValueDeprecationReasonChanged = "ENUM_VALUE_DEPRECATION_REASON_CHANGED",
    EnumValueDeprecationReasonAdded = "ENUM_VALUE_DEPRECATION_REASON_ADDED",
    EnumValueDeprecationReasonRemoved = "ENUM_VALUE_DEPRECATION_REASON_REMOVED",
    FieldRemoved = "FIELD_REMOVED",
    FieldAdded = "FIELD_ADDED",
    FieldDescriptionChanged = "FIELD_DESCRIPTION_CHANGED",
    FieldDescriptionAdded = "FIELD_DESCRIPTION_ADDED",
    FieldDescriptionRemoved = "FIELD_DESCRIPTION_REMOVED",
    FieldDeprecationAdded = "FIELD_DEPRECATION_ADDED",
    FieldDeprecationRemoved = "FIELD_DEPRECATION_REMOVED",
    FieldDeprecationReasonChanged = "FIELD_DEPRECATION_REASON_CHANGED",
    FieldDeprecationReasonAdded = "FIELD_DEPRECATION_REASON_ADDED",
    FieldDeprecationReasonRemoved = "FIELD_DEPRECATION_REASON_REMOVED",
    FieldTypeChanged = "FIELD_TYPE_CHANGED",
    FieldArgumentAdded = "FIELD_ARGUMENT_ADDED",
    FieldArgumentRemoved = "FIELD_ARGUMENT_REMOVED",
    InputFieldRemoved = "INPUT_FIELD_REMOVED",
    InputFieldAdded = "INPUT_FIELD_ADDED",
    InputFieldDescriptionAdded = "INPUT_FIELD_DESCRIPTION_ADDED",
    InputFieldDescriptionRemoved = "INPUT_FIELD_DESCRIPTION_REMOVED",
    InputFieldDescriptionChanged = "INPUT_FIELD_DESCRIPTION_CHANGED",
    InputFieldDefaultValueChanged = "INPUT_FIELD_DEFAULT_VALUE_CHANGED",
    InputFieldTypeChanged = "INPUT_FIELD_TYPE_CHANGED",
    ObjectTypeInterfaceAdded = "OBJECT_TYPE_INTERFACE_ADDED",
    ObjectTypeInterfaceRemoved = "OBJECT_TYPE_INTERFACE_REMOVED",
    SchemaQueryTypeChanged = "SCHEMA_QUERY_TYPE_CHANGED",
    SchemaMutationTypeChanged = "SCHEMA_MUTATION_TYPE_CHANGED",
    SchemaSubscriptionTypeChanged = "SCHEMA_SUBSCRIPTION_TYPE_CHANGED",
    TypeRemoved = "TYPE_REMOVED",
    TypeAdded = "TYPE_ADDED",
    TypeKindChanged = "TYPE_KIND_CHANGED",
    TypeDescriptionChanged = "TYPE_DESCRIPTION_CHANGED",
    TypeDescriptionRemoved = "TYPE_DESCRIPTION_REMOVED",
    TypeDescriptionAdded = "TYPE_DESCRIPTION_ADDED",
    UnionMemberRemoved = "UNION_MEMBER_REMOVED",
    UnionMemberAdded = "UNION_MEMBER_ADDED"
}
export declare enum CriticalityLevel {
    Breaking = "BREAKING",
    NonBreaking = "NON_BREAKING",
    Dangerous = "DANGEROUS"
}
export interface Criticality {
    level: CriticalityLevel;
    reason?: string;
}
export interface Change {
    message: string;
    path?: string;
    type: ChangeType;
    criticality: Criticality;
}
