import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import auth from "../../../../helper/authenticate";
import { useNavigate } from "react-router-dom";

interface FormData {
  bank_name: string;
  account_number: string;
  account_name: string;
}

const PaymentDetailsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  // const [driver_id, setUserId] = useState<string | null>(null);
  // const [driver_info_id, setDriverInfoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user_id from localStorage
    const storedUserId = localStorage.getItem("driver_id");

    // Get the driver_info_id that was saved after document upload
    const storedDriverInfoId = localStorage.getItem("driver_info_id");

    console.log("Stored user_id:", storedUserId);
    console.log("Stored driver_info_id:", storedDriverInfoId);

    if (!storedUserId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    if (!storedDriverInfoId) {
      setError(
        "Driver info ID not found. Please complete document upload first."
      );
      return;
    }

    // setUserId(storedUserId);
    // setDriverInfoId(storedDriverInfoId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.bank_name.trim()) {
      setError("Bank name is required");
      return false;
    }
    if (!formData.account_name.trim()) {
      setError("Account name is required");
      return false;
    }
    if (!formData.account_number.trim()) {
      setError("Account number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = "https://ziplugs.geniusexcel.tech/api/driver-bank-details";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `Failed with status: ${response.status}`
          );
        } catch {
          throw new Error(
            `Failed with status: ${response.status}. Response: ${errorText}`
          );
        }
      }

      await response.json();
      setSuccess(true);
      navigate("/contact");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="bank_name" className="text-sm font-medium">
              Bank Name
            </label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Enter bank name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="account_name" className="text-sm font-medium">
              Account Name
            </label>
            <Input
              id="account_name"
              name="account_name"
              value={formData.account_name}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Enter account name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="account_number" className="text-sm font-medium">
              Account Number
            </label>
            <Input
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Enter account number"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Payment details updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Payment Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentDetailsForm;
