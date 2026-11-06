export const inquiryFileLimit = 4_000_000;
export const inquiryBodyLimit = 4_400_000;
export const inquiryFileLimitLabel = "4 MB";
export const inquiryUploadAccept = ".pdf,.docx,.xlsx,.jpg,.jpeg,.png";

const fileTypes = {
  pdf: { type: "application/pdf", signature: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  docx: { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", signature: [0x50, 0x4b, 3, 4] },
  xlsx: { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", signature: [0x50, 0x4b, 3, 4] },
  jpg: { type: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
  png: { type: "image/png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
};

export function validateInquiryFile(name: string, declaredType: string, bytes: Uint8Array) {
  const extension = name.split(".").pop()?.toLowerCase().replace(/^jpeg$/, "jpg") || "";
  if (!Object.hasOwn(fileTypes, extension) || bytes.length > inquiryFileLimit) return null;
  const { type, signature } = fileTypes[extension as keyof typeof fileTypes];
  if ((declaredType && declaredType !== type && declaredType !== "application/octet-stream") ||
      !signature.every((byte, index) => byte === bytes[index])) return null;
  return type;
}
