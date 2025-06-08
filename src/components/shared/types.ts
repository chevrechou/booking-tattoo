export type Availability = { [day: number]: boolean };

export type Artist = {
  id: string;
  name: string;
  avatar_url: string;
  availability?: Availability;
  email?: string;
};

export type BookingFormData = {
  name: string;
  email: string;
  idea: string;
  paymentMethod: string;
  confirmationCode: string;
  imageFile?: File | null;
};

export type BookingFormProps = {
  selectedDate?: string;
  artistName?: string;
  onSubmit: (data: BookingFormData) => void;
  resetSignal?: boolean;
};

export type Booking = {
  id: number;
  date: string;
  customer_name: string;
  email: string;
  idea: string;
  payment_method: string;
  confirmation_code: string;
  image_url?: string;
};