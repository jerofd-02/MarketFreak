export interface PaymentOption {
  id: string;
  value: string;
  label: string;
}

export interface PaymentMethodGroup {
  title: string;
  options: PaymentOption[];
}

export interface PaymentUI {
  paymentMethods: PaymentMethodGroup;
  shipmentMethods: PaymentMethodGroup;
  sellerInfo: { title: string };
  submitButton: string;
}

export interface PaymentData {
  payment: PaymentUI;
}
