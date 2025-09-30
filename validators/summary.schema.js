import * as yup from "yup";

// Create new summary
export const createSummarySchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required")
});

// Update summary (all optional)
export const updateSummarySchema = yup.object({
  title: yup.string().optional(),
  content: yup.string().optional()
});