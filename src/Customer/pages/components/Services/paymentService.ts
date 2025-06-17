// This code handles the payment process using Paystack for a service booking application.

import toast from "react-hot-toast";

interface PaymentOptions {
  fare: number;
  user_mail: string;
  receiverPhone: string;
  onSuccess: () => void;
  onClose: () => void;
}

const handlePaystackPayment = ({
  fare,
  user_mail,
  receiverPhone,
  onSuccess,
  onClose,
}: PaymentOptions) => {
  const amountInKobo = fare * 100;

  if (!user_mail || !fare) {
    toast.error("Missing email or fare information.");
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: "pk_test_4ea866e39f0ab404b48f694d12039a07e98028dc",
    email: user_mail,
    amount: amountInKobo,
    currency: "NGN",
    ref: `${Date.now()}`,
    metadata: {
      custom_fields: [
        {
          display_name: "Receiver Phone",
          variable_name: "receiver_phone",
          value: receiverPhone || "N/A",
        },
      ],
    },
    callback: (response: { reference: string }) => {
      toast.success(`Payment successful! Reference: ${response.reference}`);
      onSuccess();
    },
    onClose: () => {
      toast("Payment process cancelled.");
      onClose();
    },
  });

  handler.openIframe();
};

export { handlePaystackPayment };
