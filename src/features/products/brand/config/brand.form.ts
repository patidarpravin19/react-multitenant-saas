import { FormFieldConfig } from "../../../../types/form";

interface BrandFormOptions {
  vendors: {
    id: string;
    name: string;
  }[];
}

export function createBrandFormConfig({
  vendors,
}: BrandFormOptions): FormFieldConfig[] {
  return [
    {
      id: "vendorId",
      name: "vendorId",
      label: "Vendor",
      type: "select",
      required: true,

      options:
        vendors.map(
          vendor => ({
            label:
              vendor.name,

            value:
              vendor.id,
          }),
        ),
    },

    {
      id: "name",
      name: "name",
      label: "Brand Name",
      type: "text",
      required: true,
      placeholder:
        "Example: Samsung",
    },

    {
      id: "code",
      name: "code",
      label: "Brand Code",
      type: "text",
      required: true,
      placeholder:
        "Example: SAM",
    },

    {
      id: "description",
      name: "description",
      label: "Description",
      type: "textarea",
    },

    {
      id: "isActive",
      name: "isActive",
      label: "Active",
      type: "toggle",
      defaultValue: true,
    },
  ];
}