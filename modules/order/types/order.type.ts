export type OrderStatus =
  | "NEW"
  | "PENDING_CONFIRMATION"
  | "CANCELLED"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED_NO_REFUND"
  | "CANCELLED_PARTIAL_REFUND"
  | "FAILED_DELIVERY";

export interface OrderVariantInfo {
  id: string;
  color?: {
    id: string;
    nameEn?: string;
    nameVi?: string;
    nameKm?: string;
    code?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  size?: {
    id: string;
    nameEn?: string;
    nameVi?: string;
    nameKm?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  stock?: number;
  variantType?: string;
}

export interface OrderItem {
  id: string;
  product: {
    id: string;
    nameVi: string;
    nameEn?: string;
    nameKm?: string;
    slug?: string;
    description?: string;
    thumbnailUrl?: string;
    thumbnailId?: string;
    variantType?: string;
    originalPrice?: number;
    salePrice?: number;
    discountPercent?: number;
    stock?: number;
    images?: Array<{
      id: string;
      fileId: string;
      url: string;
      alt?: string;
      sortOrder?: number;
    }>;
    category?: {
      id: string;
      nameVi?: string;
      nameEn?: string;
      nameKm?: string;
      slug?: string;
      createdAt?: string | Date;
      updatedAt?: string | Date;
    };
    variants?: unknown[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  variant?: OrderVariantInfo;
  quantity: number;
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  id: number;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  reason?: string;
  changedAt: string | Date;
  changedBy?: {
    id: string;
    userName?: string;
    email?: string;
    fullName?: string;
  } | null;
}

export interface Order {
  id: string;
  orderId: string;
  userId?: string;
  user?: {
    id: string;
    userName?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    role?: string;
    dateOfBirth?: string | Date;
    gender?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  paidAmount?: number;
  refundAmount?: number;
  status: OrderStatus;
  items?: OrderItem[];
  reason?: string;
  statusHistory?: OrderStatusHistory[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderListResponse {
  data: Order[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}
