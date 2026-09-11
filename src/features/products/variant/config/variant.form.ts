import type {
  FormFieldConfig,
} from "../../../../types/form";

interface VariantFormOptions {
  models: {
    id: string;
    name: string;
  }[];
}

export function createVariantFormConfig({
  models,
}: VariantFormOptions): FormFieldConfig[] {
  return [
    {
      id:
        "productModelId",

      name:
        "productModelId",

      label:
        "Product Model",

      type:
        "select",

      required:
        true,

      options:
        models.map(
          model => ({
            label:
              model.name,

            value:
              model.id,
          }),
        ),
    },

    {
      id: "name",
      name: "name",
      label:
        "Variant Name",
      type: "text",
      required: true,

      placeholder:
        "8 GB + 128 GB",
    },

    {
      id: "code",
      name: "code",
      label:
        "Variant Code",
      type: "text",
      required: true,

      placeholder:
        "8-128",
    },

    {
      id: "ram",
      name: "ram",
      label: "RAM",
      type: "text",
      required: true,

      placeholder:
        "8 GB",
    },

    {
      id: "rom",
      name: "rom",
      label: "ROM",
      type: "text",
      required: true,

      placeholder:
        "128 GB",
    },

    {
      id:
        "processor",

      name:
        "processor",

      label:
        "Processor",

      type:
        "text",

      placeholder:
        "Snapdragon 8 Gen 3",
    },

    {
      id:
        "description",

      name:
        "description",

      label:
        "Description",

      type:
        "textarea",
    },

    {
      id:
        "isActive",

      name:
        "isActive",

      label:
        "Active",

      type:
        "toggle",

      defaultValue:
        true,
    },
  ];
}