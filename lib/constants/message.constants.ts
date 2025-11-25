export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successfully",
  LOGIN_FAILED: "Login failed, please try again",
  LOGOUT_SUCCESS: "Logout successfully",
  LOGOUT_FAILED: "Logout failed, please try again",
  LOGOUT_ERROR: "An error occurred, please try again later",
};

export const UPLOAD_MESSAGES = {
  UPLOAD_SUCCESS: (count: number) => `Successfully uploaded ${count} file${count > 1 ? "s" : ""}`,
  FILE_DELETED_SUCCESS: "File deleted successfully",
  THUMBNAIL_UPLOAD_SUCCESS: "Thumbnail uploaded successfully",
  THUMBNAIL_DELETED_SUCCESS: "Thumbnail deleted successfully",
  MAX_FILES_EXCEEDED: (maxFiles: number, currentCount: number) =>
    `Maximum ${maxFiles} files allowed. You have ${currentCount} files, can only add ${maxFiles - currentCount} more.`,
  UPLOADING_FILES: "Uploading files...",
  DELETING_FILE: "Deleting file...",
  UPLOADING_THUMBNAIL: "Uploading thumbnail...",
  DELETING_THUMBNAIL: "Deleting thumbnail...",
};

export const CATEGORY_GROUP_MESSAGES = {
  CREATED_SUCCESS: "Category group created successfully!",
  UPDATED_SUCCESS: "Category group updated successfully!",
  DELETED_SUCCESS: "Category group deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} category groups!`,
  CANNOT_DELETE_WITH_CHILDREN: (name: string) =>
    `Cannot delete category group "${name}" because it still has child categories. Please delete child categories first.`,
  CANNOT_DELETE_MULTIPLE_WITH_CHILDREN: (names: string) =>
    `Cannot delete category groups "${names}" because they still have child categories. Please delete child categories first.`,
};

export const COLOR_MESSAGES = {
  CREATED_SUCCESS: "Color created successfully!",
  UPDATED_SUCCESS: "Color updated successfully!",
  DELETED_SUCCESS: "Color deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} colors!`,
};

export const SIZE_MESSAGES = {
  CREATED_SUCCESS: "Size created successfully!",
  UPDATED_SUCCESS: "Size updated successfully!",
  DELETED_SUCCESS: "Size deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} sizes!`,
};

export const CATEGORY_MESSAGES = {
  CREATED_SUCCESS: "Category created successfully!",
  UPDATED_SUCCESS: "Category updated successfully!",
  DELETED_SUCCESS: "Category deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} categories!`,
};

export const PRODUCT_MESSAGES = {
  CREATED_SUCCESS: "Product created successfully!",
  UPDATED_SUCCESS: "Product updated successfully!",
  DELETED_SUCCESS: "Product deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} products!`,
  INVALID_IMAGES_DATA: "Some images have invalid data. Please check and try again.",
  DUPLICATE_SORT_ORDERS: "Images have duplicate sort orders. Please check and try again.",
};

export const ORDER_MESSAGES = {
  STATUS_UPDATED: "Order status updated",
  STATUS_UPDATE_FAILED: "Failed to update order status",
};

export const MENU_MESSAGES = {
  CREATED_SUCCESS: "Menu created successfully!",
  UPDATED_SUCCESS: "Menu updated successfully!",
  DELETED_SUCCESS: "Menu deleted successfully!",
  BULK_DELETED_SUCCESS: (count: number) => `Successfully deleted ${count} menus!`,
};
