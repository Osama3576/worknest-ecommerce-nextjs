export type ProductFormActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  redirectTo?: string;
};

export const initialProductFormActionState: ProductFormActionState = {
  status: 'idle',
};
