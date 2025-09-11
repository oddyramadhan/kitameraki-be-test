import { formsContainer } from "../lib/cosmosClient";

export async function getAllForms(tenantId: string) {
    const { resources } = await formsContainer.items
        .query(`SELECT * FROM c`, {
            partitionKey: tenantId,
        })
        .fetchAll();
    return resources;
}

export async function getFormsById(tenantId: string, formId: string) {
    const { resource } = await formsContainer.item(formId, tenantId).read();
    return resource;
}

export async function insertForm(form: any) {
    const { resource } = await formsContainer.items.create(form);
    return resource;
}

export async function updateForm(tenantId: string, formId: string, form: any) {
    const { resource } = await formsContainer.item(formId, tenantId).replace(form);
    return resource;
}